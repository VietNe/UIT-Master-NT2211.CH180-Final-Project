# -*- coding: utf-8 -*-
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report
from xgboost import XGBClassifier
import joblib


def load_and_preprocess_data(filepath):
    """Load and preprocess data"""
    dataset = pd.read_csv(filepath)
    X = dataset.iloc[:, 1:-1].values
    Y = dataset.iloc[:, -1].values

    # Handle missing data
    imputer = SimpleImputer(missing_values=np.nan, strategy='mean')
    imputer.fit(X[:, 1:47])
    X[:, 1:47] = imputer.transform(X[:, 1:47])

    # Encode dependent variable
    le = LabelEncoder()
    Y = le.fit_transform(Y)

    # Split dataset
    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=1)

    # Standardize data
    sc = StandardScaler()
    X_train = sc.fit_transform(X_train)
    X_test = sc.transform(X_test)

    return X_train, X_test, y_train, y_test, le


def train_and_save_model_once(X_train, y_train, params, model_path):
    """Train the model only if it hasn't been trained before"""
    if os.path.exists(model_path):
        print(f"Model already exists at {model_path}. Skipping training.")
    else:
        classifier = XGBClassifier(**params)
        classifier.fit(X_train, y_train)
        joblib.dump(classifier, model_path)
        print(f"Model trained and saved to {model_path}")


def load_model_and_evaluate(model_path, X_test, y_test, label_encoder):
    """Load the model and evaluate its performance"""
    classifier = joblib.load(model_path)
    y_pred = classifier.predict(X_test)

    # Decode labels for report
    y_test_original = label_encoder.inverse_transform(y_test)
    y_pred_original = label_encoder.inverse_transform(y_pred)

    # Generate classification report
    report = classification_report(y_test_original, y_pred_original, digits=4)
    print("Classification Report:")
    print(report)


def main():
    # Filepath to dataset
    dataset_path = './data/train.csv'

    # Model save path
    model_path = './model/optimized_model.pkl'

    # Optimized parameters
    optimized_params = {
        'n_estimators': 182,
        'max_depth': 10,
        'learning_rate': 0.19879820388928054
    }

    # Step 1: Load and preprocess data
    X_train, X_test, y_train, y_test, le = load_and_preprocess_data(dataset_path)

    # Step 2: Train model only if it hasn't been trained
    train_and_save_model_once(X_train, y_train, optimized_params, model_path)

    # Step 3: Load model and evaluate
    load_model_and_evaluate(model_path, X_test, y_test, le)


if __name__ == "__main__":
    main()
