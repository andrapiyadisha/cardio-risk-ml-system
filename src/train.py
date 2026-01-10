# import pandas as pd
# import numpy as np
# import time
# from .model import build_tree, predict
# from sklearn.model_selection import train_test_split

# # --- CONFIGURATION ---
# DATA_PATH = "data/processed/CardioPreprocessed.csv"
# MAX_DEPTH = 12
# MIN_SIZE = 50
# THRESHOLD = 0.5
# TARGET = "cardio"


# def calculate_metrics(y_true, y_pred):
#     tp = np.sum((y_pred == 1) & (y_true == 1))
#     tn = np.sum((y_pred == 0) & (y_true == 0))
#     fp = np.sum((y_pred == 1) & (y_true == 0))
#     fn = np.sum((y_pred == 0) & (y_true == 1))

#     accuracy = (tp + tn) / len(y_true)
#     precision = tp / (tp + fp) if (tp + fp) > 0 else 0
#     recall = tp / (tp + fn) if (tp + fn) > 0 else 0
#     f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0

#     return accuracy, precision, recall, f1

# def main():
#     print("Loading data...")
#     try:
#         df = pd.read_csv(DATA_PATH, sep=';')
#         if len(df.columns) == 1:
#             df = pd.read_csv(DATA_PATH)
#     except Exception:
#         df = pd.read_csv(DATA_PATH)

#     df.columns = df.columns.str.lower().str.strip()
#     df = df.loc[:, ~df.columns.str.contains("^unnamed")]
#     print("Columns:", df.columns.tolist())

#     drop_cols = [c for c in [TARGET, "id"] if c in df.columns]
#     X = df.drop(columns=drop_cols).values
#     y = df[TARGET].values
  
#     print(f"Training with {X.shape[1]} features.")

#     # ✅ STRATIFIED SPLIT (CORRECT)
#     X_train, X_test, y_train, y_test = train_test_split(
#         X, y,
#         test_size=0.2,
#         random_state=42,
#         stratify=y
#     )

#     train_data = np.column_stack((X_train, y_train))

#     print("Training Decision Tree (Manual Implementation)...")
#     start_time = time.time()
#     tree = build_tree(train_data, max_depth=MAX_DEPTH, min_size=MIN_SIZE)
#     print(f"Training completed in {time.time() - start_time:.2f} seconds.")

#     print("Evaluating...")
#     train_probs = np.array([predict(tree, row) for row in X_train])
#     test_probs = np.array([predict(tree, row) for row in X_test])

#     train_preds = (train_probs >= THRESHOLD).astype(int)
#     test_preds = (test_probs >= THRESHOLD).astype(int)

#     tr_acc, tr_prec, tr_rec, tr_f1 = calculate_metrics(y_train, train_preds)
#     te_acc, te_prec, te_rec, te_f1 = calculate_metrics(y_test, test_preds)

#     print("\n--- RESULTS ---")
#     print(f"{'Metric':<15} {'Train':<10} {'Test':<10}")
#     print("-" * 35)
#     print(f"{'Accuracy':<15} {tr_acc:.4f}     {te_acc:.4f}")
#     print(f"{'Precision':<15} {tr_prec:.4f}     {te_prec:.4f}")
#     print(f"{'Recall':<15} {tr_rec:.4f}     {te_rec:.4f}")
#     print(f"{'F1 Score':<15} {tr_f1:.4f}     {te_f1:.4f}")
#     print("-" * 35)

#     if tr_acc - te_acc > 0.1:
#         print("\n[WARNING] Model is Overfitting")
#     elif tr_acc < 0.6 and te_acc < 0.6:
#         print("\n[WARNING] Model is Underfitting")
#     else:
#         print("\n[SUCCESS] Model is Well-Fitted")

#     import pickle, os
#     os.makedirs("models", exist_ok=True)
#     with open("models/cardio_model.pkl", "wb") as f:
#         pickle.dump(tree, f)

#     print("\nModel saved to models/cardio_model.pkl")

# if __name__ == "__main__":
#     main()
import pandas as pd
import numpy as np
import time
import pickle, os
from .model import build_tree, predict
from sklearn.model_selection import train_test_split, StratifiedKFold

# --- CONFIGURATION ---
DATA_PATH = "data/processed/CardioPreprocessed.csv"
TARGET = "cardio"
THRESHOLD = 0.5

# Hyperparameter search space
MAX_DEPTHS = [5, 10, 15, 20]
MIN_SIZES = [20, 50, 100]
K_FOLDS = 5


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
    skf = StratifiedKFold(n_splits=K_FOLDS, shuffle=True, random_state=42)

    best_acc = 0
    best_params = None

    print("\nStarting Cross Validation...\n")

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

            print(f"Depth={max_depth}, MinSize={min_size} → CV Accuracy={mean_acc:.4f}")

            if mean_acc > best_acc:
                best_acc = mean_acc
                best_params = (max_depth, min_size)

    print("\n✅ Best Hyperparameters Found:")
    print(f"Max Depth: {best_params[0]}, Min Size: {best_params[1]}")
    print(f"Best CV Accuracy: {best_acc:.4f}")

    return best_params


def main():
    print("Loading data...")
    df = pd.read_csv(DATA_PATH)
    df.columns = df.columns.str.lower().str.strip()
    df = df.loc[:, ~df.columns.str.contains("^unnamed")]

    X = df.drop(columns=[TARGET, "id"], errors="ignore").values
    y = df[TARGET].values

    # Hold-out test set (never used in CV)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    # 🔥 CROSS VALIDATION
    best_depth, best_min_size = cross_validate(X_train, y_train)

    # 🔁 Train final model on full training data
    print("\nTraining Final Model...")
    train_data = np.column_stack((X_train, y_train))
    start = time.time()
    final_tree = build_tree(train_data, best_depth, best_min_size)
    print(f"Training completed in {time.time() - start:.2f} seconds")

    # 📊 Evaluation
    train_probs = np.array([predict(final_tree, row) for row in X_train])
    test_probs = np.array([predict(final_tree, row) for row in X_test])

    train_preds = (train_probs >= THRESHOLD).astype(int)
    test_preds = (test_probs >= THRESHOLD).astype(int)

    tr_acc, tr_prec, tr_rec, tr_f1 = calculate_metrics(y_train, train_preds)
    te_acc, te_prec, te_rec, te_f1 = calculate_metrics(y_test, test_preds)

    print("\n--- FINAL RESULTS ---")
    print(f"{'Metric':<15} {'Train':<10} {'Test':<10}")
    print("-" * 35)
    print(f"Accuracy        {tr_acc:.4f}     {te_acc:.4f}")
    print(f"Precision       {tr_prec:.4f}     {te_prec:.4f}")
    print(f"Recall          {tr_rec:.4f}     {te_rec:.4f}")
    print(f"F1 Score        {tr_f1:.4f}     {te_f1:.4f}")

    # 💾 Save model
    os.makedirs("models", exist_ok=True)
    with open("models/cardio_model.pkl", "wb") as f:
        pickle.dump(final_tree, f)

    print("\n✅ Model saved to models/cardio_model.pkl")


if __name__ == "__main__":
    main()
