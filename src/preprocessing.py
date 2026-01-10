import pandas as pd

def preprocess_data(output_path):
    # Read FINAL dataset (comma-separated)
    df = pd.read_csv(output_path)

    # 🔥 Drop unwanted unnamed index columns
    df = df.loc[:, ~df.columns.str.contains("^unnamed")]

    print("Final engineered dataset cleaned.")
    print("Columns:", df.columns.tolist())
    print("Total features (excluding target):", len(df.columns) - 1)

    # OPTIONAL: save cleaned file back (recommended)
    df.to_csv(output_path, index=False)

if __name__ == "__main__":
    preprocess_data(
        output_path="data/processed/CardioPreprocessing.csv"
    )
