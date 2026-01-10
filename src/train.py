import pandas as pd
import numpy as np
import time
import pickle
import os

from sklearn.model_selection import train_test_split, StratifiedKFold
from .model import build_tree, predict

# ---------------- CONFIGURATION ----------------
DATA_PATH = "data/processed/CardioPreprocessed.csv"
TARGET = "cardio"
THRESHOLD = 0.5

# Hyperparameter search space
MAX_DEPTHS = [5, 10, 15, 20]
MIN_SIZES = [20, 50, 100]
K_FOLDS = 5
RANDOM_STATE = 42
# ------------------------------------------------


def calculate_metrics(y_true, y_pred):
    tp = np.sum((y_pred == 1) & (y_true == 1))
    tn = np.sum((y_pred == 0) & (y_true == 0))
    fp = np.sum((y_pred == 1) & (y_true == 0))
    fn = np.sum((y_pred == 0) & (y_true == 1))

    accuracy = (tp + tn) / len(y_true)
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * precision * recall / (precision + recall) if (precision + recall) > 0 else 0

    return accuracy, precision, recall, f1


def cross_validate(X, y):
    """
    Perform Stratified K-Fold Cross Validation to find best hyperparameters
    """
    skf = StratifiedKFold(
        n_splits=K_FOLDS,
        shuffle=True,
        random_state=RANDOM_STATE
    )

    best_accuracy = 0
    best_params = None

    print("\n Starting Stratified K-Fold Cross Validation...\n")

    for max_depth in MAX_DEPTHS:
        for min_size in MIN_SIZES:
            fold_accuracies = []

            for train_idx, val_idx in skf.split(X, y):
                X_train, X_val = X[train_idx], X[val_idx]
                y_train, y_val = y[train_idx], y[val_idx]

                train_data = np.column_stack((X_train, y_train))
                tree = build_tree(train_data, max_depth, min_size)

                probs = np.array([predict(tree, row) for row in X_val])
                preds = (probs >= THRESHOLD).astype(int)

                acc, _, _, _ = calculate_metrics(y_val, preds)
                fold_accuracies.append(acc)

            mean_acc = np.mean(fold_accuracies)

            print(
                f"Depth={max_depth}, MinSize={min_size} "
                f"→ CV Accuracy={mean_acc:.4f}"
            )

            if mean_acc > best_accuracy:
                best_accuracy = mean_acc
                best_params = (max_depth, min_size)

    print("\n Best Hyperparameters Found:")
    print(f"Max Depth : {best_params[0]}")
    print(f"Min Size  : {best_params[1]}")
    print(f"Best CV Accuracy : {best_accuracy:.4f}")

    return best_params


def main():
    print("Loading data...")

    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.lower().str.strip()
    df = df.loc[:, ~df.columns.str.contains("^unnamed")]

    X = df.drop(columns=[TARGET, "id"], errors="ignore").values
    y = df[TARGET].values

    print(f" Total Samples: {len(X)}")
    print(f" Total Features: {X.shape[1]}")

    # ---------------- TRAIN–TEST SPLIT ----------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        stratify=y,
        random_state=RANDOM_STATE
    )

    print("Train–Test Split Completed")

    # ---------------- CROSS VALIDATION ----------------
    best_depth, best_min_size = cross_validate(X_train, y_train)

    # ---------------- FINAL TRAINING ----------------
    print("\n Training Final Model with Best Hyperparameters...")
    train_data = np.column_stack((X_train, y_train))

    start_time = time.time()
    final_tree = build_tree(train_data, best_depth, best_min_size)
    print(f"Training completed in {time.time() - start_time:.2f} seconds")

    # ---------------- EVALUATION ----------------
    train_probs = np.array([predict(final_tree, row) for row in X_train])
    test_probs = np.array([predict(final_tree, row) for row in X_test])

    train_preds = (train_probs >= THRESHOLD).astype(int)
    test_preds = (test_probs >= THRESHOLD).astype(int)

    tr_acc, tr_prec, tr_rec, tr_f1 = calculate_metrics(y_train, train_preds)
    te_acc, te_prec, te_rec, te_f1 = calculate_metrics(y_test, test_preds)

    print("\n FINAL RESULTS")
    print(f"{'Metric':<15} {'Train':<10} {'Test':<10}")
    print("-" * 35)
    print(f"Accuracy        {tr_acc:.4f}     {te_acc:.4f}")
    print(f"Precision       {tr_prec:.4f}     {te_prec:.4f}")
    print(f"Recall          {tr_rec:.4f}     {te_rec:.4f}")
    print(f"F1 Score        {tr_f1:.4f}     {te_f1:.4f}")
    print("-" * 35)

    # ---------------- SAVE MODEL ----------------
    os.makedirs("models", exist_ok=True)
    with open("models/cardio_model.pkl", "wb") as f:
        pickle.dump(final_tree, f)

    print("\n✅ Best model saved to models/cardio_model.pkl")


if __name__ == "__main__":
    main()
