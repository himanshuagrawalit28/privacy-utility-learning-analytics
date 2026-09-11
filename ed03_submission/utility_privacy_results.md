# ED-03 Privacy-Utility Results

| Model Type | Balanced Accuracy ($U_{pred}$) | AUROC | Privacy Score ($U_{privacy}$) |
| :--- | :--- | :--- | :--- |
| **Baseline Model** | 72.96% | 79.30% | 0.9976 |
| **Protected Model (L2 Regularization)** | 73.14% | 78.62% | 0.9951 |

## Conclusion
The baseline Logistic Regression model did not overfit the training data due to our aggressive Day-90 feature selection. As a result, the baseline model is inherently resistant to the scikit-learn Logistic Regression Membership Inference Attack, achieving a near-perfect privacy score of 0.9976. 

Adding the L2 Regularization penalty as a privacy mechanism performed as expected on an already-private model: it slightly perturbed the probabilities, which maintained high predictive utility (73.14%) but resulted in a mathematically insignificant change to the privacy score (0.9951).
