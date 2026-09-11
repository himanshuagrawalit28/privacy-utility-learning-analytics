# Privacy Claims and Limitations Note
**Project:** ED-03 Privacy-Utility Learning Analytics Under Membership Attack

## Privacy Mechanism Claim
Our primary privacy protection mechanism relies on **heavy L2 Regularization (High Penalty)** applied to a Logistic Regression model. By strongly penalizing large weights during the training phase, the model is mathematically discouraged from memorizing specific training records (overfitting). This ensures that the model learns generalized trends across the OULAD student population rather than individual-specific artifacts.

## Empirical Defense Against Membership Inference
According to the rules of ED-03, we implemented the fixed Scikit-Learn `liblinear` Logistic Regression Membership Inference Attack to evaluate our mechanism.

**Findings:**
Because our Day-90 feature engineering (10 carefully selected features over 19,000+ rows) naturally prevented the baseline model from overfitting, the attack model failed to distinguish between members and non-members. The baseline model achieved an Effective Attack AUC ($A_{eff}$) of ~0.501, resulting in a near-perfect Privacy Utility ($U_{privacy}$) of **0.9976**.

Applying our L2 regularization technique yielded a Protected Model that maintained strong predictive utility (73.14% balanced accuracy) while retaining an equivalent near-perfect Privacy Utility of **0.9951**. 

## Limitations
1. **No Formal Differential Privacy Claim:** While our L2 Regularization empirically defeated the specified Membership Inference Attack, it does not guarantee formal mathematically bound Differential Privacy (DP). It is designed strictly for empirical membership-inference resistance.
2. **Feature Breadth:** If the model were to be expanded to include hundreds of high-dimensional behavioral features (e.g., highly granular daily VLE clickstreams instead of aggregates), the baseline model would likely overfit, requiring the L2 Regularization penalty to be tuned significantly higher to maintain the same $U_{privacy}$ score.
