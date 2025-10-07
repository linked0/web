# Overview
### 실행 방법
python3 -m venv .venv
source ./.venv/bin/activate
pip3 install -r requirements.txt
python3 kaggle.py

### History
##### 2023.11.17
필요한 패키지 확인하고 requirements.txt 생성
화면이 뜨고, 첫 화면에서 `Train` 버튼 동작하는 것까지 확인

# Details

### 폴더 구조 설명
- lib 폴더는 일단 깃헙에서 제거됨
- test/kevin_murphy 폴더는 일단 깃헙에서 제거됨

### 필드 의미
- 각각의 필드 의미를 파악해야 함. 

### 필드
- PassengerId: int, 1부터 시작되는 승객 아이디
- Survived: int, 생존여부, 예측의 대상이 되는 y 값
- Pclass: int, 승객 입장권 클래스, 1이 가장 높고, 3이 가장 낮음
    > Fare 평균은 1: , 2:, 3: 
- Name: str
- Sex: str, 0:male/1:femaie
- Age: int
- SibSp: int, Number of Siblings/Spouses Aboard
- Parch: int, Number of Parents/Children Aboard
- Ticket: str, 의미없음
- Fare: float, 값이 0인경우가 15건이 됨.
- Cabin: str, 의미없음 
- Embarked: char, Southampton, Cherbourg, Queenstown
    > Fare 평균은 C: 59.95, S: 27.08, Q: 13.28

### 필드(비대상)


### 작업 순서
1. 필드 의미 파악
    - dt.head()로 데이터의 일부를 본다.
    - 각 필드의 데이터 타입 확인 
    - 다음의 같이 간단하게 추가의미를 파악한다.
        > dt[dt.Pclass == 1].Fare.mean()
    - 인터넷 검색등을 통해서 정보 알아내기.
2. missing data check 및 처리 (당연히 전체 데이터로 처리)
    - NaN도 확인해야하지만 값이 0인 경우도 확인해야 함. 이런 경우, isnull함수로 확인 불가능
    - Age: mean이 아닌 median을 사용함.
    - Fare: 클래스별 평균으로 입력한다.
        > missing 개수: Pclass 1 -> 5개, Pclass 2 -> 6, Pclass 3 -> 4
        > 클래스별 Fare 평균: 1 -> 86.15, 2 -> 21.36, 3 -> 13.79
    - Embarked: S: 644, C: 168, Q: 77, nan: 2
        > 제일 많은 S로 처리함. 
3. 모든 데이터를 numeric으로 바꾼다.
4. udacity MNIST 예제처럼 overlapping되는 샘플을 찾는다. 다음의 문제를 확인 잘 할 것
    Problem 5
    By construction, this dataset might contain a lot of overlapping samples, including training data that's also contained in the validation and test set! Overlap between training and test can skew the results if you expect to use your model in an environment where there is never an overlap, but are actually ok if you expect to see training samples recur when you use it. Measure how much overlap there is between training, validation and test samples.
    Optional questions:
    What about near duplicates between datasets? (images that are almost identical)
    Create a sanitized validation and test set, and compare your accuracy on those in subsequent assignments.
4. 결과 값을 one hot encoding으로 바꾼다.
5. train/test set 분리
6. preprocessing
    - standardization 수행 
    - 다른 필드와의 covariance 파악 
7. 각 모델에 대한 모듈(kernel_svm 등)으로 각각의 최적 hyperparameter를 선택하기
8. RandomizedSearchCV를 이용하는 param_search 모듈로 최적의 hyperparameter 찾아보기
9. GridSearchCV 이용하기 -> 아직 GridSearchCV가 동작하지 않는 문제 있음

--------------------------------------------------------------------
### 트레이닝 중간 결과
1. PCA의 feature 개수를 2로 했을때 전체보다 더 나쁨.
- Logistic Regression with PCA:False
    > Test Accuracy: 0.816
- Logistic Regression with PCA:True
    > Test Accuracy: 0.709
- Logistic Regression (cross validation) with PCA: False
    > CV accuracy: 0.785 +/- 0.041
- Logistic Regression (cross validation) with PCA: True
    > CV accuracy: 0.679 +/- 0.059
    
2. RandomizedSearchCV로 테스트했을때의 성능
- ## 중간 결론: parameter와 RandomizedSearchCV의 n_iter값을 어떻게 주느냐에 따라 값이 많이 차이남.
- RandomForestClassifier
    > params
    param_dist = {"max_depth": [3, None],
                "max_features": sp_randint(1, 7),
                "min_samples_split": sp_randint(1, 11),
                "min_samples_leaf": sp_randint(1, 11),
                "bootstrap": [True, False],
                "criterion": ["gini", "entropy"]}
    > 결과
    best score: 0.832865
    best estimator: RandomForestClassifier(bootstrap=False, class_weight=None,
            criterion='entropy', max_depth=None, max_features=2,
            max_leaf_nodes=None, min_samples_leaf=9, min_samples_split=3,
            min_weight_fraction_leaf=0.0, n_estimators=20, n_jobs=1,
            oob_score=False, random_state=None, verbose=0,
            warm_start=False)
    best parameters: {'bootstrap': False, 'min_samples_leaf': 9, 'min_samples_split': 3, 'criterion': 'entropy', 'max_features': 2, 'max_depth': None}

    > 다른 하이퍼파라미터를 확인해봐야 함.
    
- SVC
    > params
    param_dist = {
          'clf__C': [0.01, 0.1, 1, 10, 100, 1000],
          'clf__gamma': [0.01, 0.1, 1, 10, 100, 1000],
          'clf__kernel': ['rbf', 'linear'],
    }
    > 결과
    best score: 0.824438
    best estimator: Pipeline(steps=[('scl', StandardScaler(copy=True, with_mean=True, with_std=True)), ('clf', SVC(C=1, cache_size=200, class_weight=None, coef0=0.0,
        decision_function_shape=None, degree=3, gamma=0.1, kernel='rbf',
        max_iter=-1, probability=False, random_state=None, shrinking=True,
        tol=0.001, verbose=False))])
    best params: {'clf__gamma': 0.1, 'clf__C': 1, 'clf__kernel': 'rbf'}

3. Random Forest옴(160719)
    > High Variance 발생
        Train accuracy: 0.982
        Test accuracy: 0.838
    > learning_curve를 실행시켜보면 확실하게 보임
    > 어떻게 해결한다?


