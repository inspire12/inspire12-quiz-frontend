1. Elasticsearch의 CRUD 동작에서 틀린 설명은?
A. POST는 새 문서를 생성할 때 사용됨
B. PUT은 전체 문서를 수정할 때 사용됨
C. _update는 기존 문서를 부분 수정할 때 사용됨
D. DELETE는 문서 일부 필드를 제거함

정답: D
해설: DELETE는 문서 전체를 삭제함. 필드 제거는 _update로 null 처리하거나 script 사용.
출제의도: ES CRUD 명령어별 정확한 역할을 알고 있는지 확인.

2. ElasticsearchOperations를 사용할 때 장점으로 보기 어려운 것은?
A. 복잡한 Bool 쿼리를 Builder 패턴으로 작성할 수 있음
B. JSON 쿼리를 그대로 코드에 붙여넣어 실행할 수 있음
C. QueryDSL을 그대로 사용할 수 있음
D. CriteriaQuery로 간단한 조건 필터링이 가능함

정답: C
해설: Elasticsearch는 Spring Data Elasticsearch 기반의 Query 객체를 사용함. JPA용 QueryDSL과는 다름.
출제의도: ElasticsearchOperations와 JPA의 쿼리 방식 차이를 구분할 수 있는지 평가.

3. 다음 중 Spring Data Elasticsearch의 SearchHits 설명으로 틀린 것은?
A. 검색된 문서들을 SearchHit<T> 형태로 제공함
B. 각 문서의 스코어(score) 정보를 확인할 수 있음
C. highlightFields를 통해 강조된 단어를 받을 수 있음
D. 검색 결과는 항상 1개 이상의 hit를 보장함

정답: D
해설: 검색 조건에 따라 결과가 없을 수도 있으므로 hit는 0개일 수 있음.
출제의도: SearchHits 구조에서 오해할 수 있는 기본 가정을 확인하고자 함.

4. 다음 중 Elasticsearch에서 추천 검색 품질에 영향을 주는 요소가 아닌 것은?
A. TF 값
B. IDF 값
C. 문서 길이
D. 검색된 시간

정답: D
해설: ES는 기본적으로 **통계 기반(TF, IDF, BM25 등)**으로 점수를 계산함. 검색 시간은 영향 없음.
출제의도: ES의 점수 계산 알고리즘에서 실제 반영되는 요소를 알고 있는지 점검.

5. Elasticsearch와 RDB를 함께 사용할 때 고려할 점으로 틀린 것은?
A. RDB의 동시성 처리가 완료된 후 데이터를 ES에 저장해야 함
B. Index Template을 명시적으로 정의해야 관리가 용이함
C. CQRS 패턴처럼 조회 전용 구조를 별도로 둘 수 있음
D. 실시간으로 RDB에서 조인을 통해 검색하면 더 효율적임

정답: D
해설: ES는 조회 전용 구조이며, RDB처럼 조인을 실시간으로 처리하지 않음. 조인이 필요하다면 문서 내 중첩 설계나 중복 저장이 필요함.
출제의도: RDB vs ES의 조회 방식 차이와 설계 관점 차이를 이해했는지 판단.

