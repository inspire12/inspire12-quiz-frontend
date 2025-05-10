1. 인덱스 선택성(Selectivity)에 대한 설명으로 가장 적절한 것은?
A. 인덱스는 항상 높은 중복도를 가진 컬럼에 사용해야 한다
B. 선택성이 낮을수록 인덱스 성능이 좋다
C. 선택성이 높을수록 인덱스 효율이 높다
D. PK보다 FK 컬럼에 인덱스를 우선해야 한다

정답: C
해설: 선택성은 (고유값 수 / 전체 행 수)로 정의되며, 높을수록 인덱스가 효율적임. 중복이 많으면 인덱스 의미가 떨어짐.

2. 다음 중 쿼리 성능에 가장 큰 영향을 주는 실행 계획 요소는?
A. Handler_read_rnd
B. Using temporary
C. Buffer pool size
D. Slow query threshold

정답: B
해설: Using temporary는 쿼리 수행 중 임시 테이블을 생성하는 것으로, 메모리가 부족하면 디스크로 옮겨져 성능 급감 가능.

3. InnoDB에서 데이터 읽기 속도에 가장 직접적으로 영향을 주는 요소는?
A. redo log 파일 크기
B. buffer pool 사이즈
C. binary log 활성화 여부
D. fulltext index 여부

정답: B
해설: InnoDB는 대부분의 데이터를 Buffer Pool에서 읽기 때문에 메모리 캐시 크기가 성능에 큰 영향을 줌.

4. 다음 중 MySQL 쿼리 튜닝을 위해 EXPLAIN으로 확인할 수 없는 것은?
A. 사용된 인덱스
B. 실제 처리 시간
C. 테이블 접근 방식
D. rows 예측 건수

정답: B
해설: EXPLAIN은 쿼리 계획만 보여주고 실제 실행 시간은 알 수 없음. 시간은 slow query log 등으로 분석.

5. 다음 중 조인 성능이 가장 좋지 않을 수 있는 유형은?
A. index nested-loop join
B. hash join
C. block nested-loop join
D. full table scan 후 nested-loop join

정답: D
해설: 두 테이블 모두 인덱스 없이 full scan한 후 loop join을 하면 조합 수 만큼 반복되어 성능 저하 심함.

6. MySQL에서 쿼리 캐시(query cache)가 문제가 될 수 있는 상황은?
A. 데이터 변경이 잦은 환경
B. 분석 쿼리 위주의 환경
C. 트랜잭션이 많은 환경
D. 읽기 전용 환경

정답: A
해설: 데이터 변경이 많으면 캐시가 자주 무효화되어 오히려 부하가 증가함. MySQL 8.0부터는 제거됨.

7. 다음 중 슬로우 쿼리 로그 설정을 위한 필수 조건이 아닌 것은?
A. slow_query_log = ON
B. long_query_time 설정
C. log_queries_not_using_indexes 설정
D. general_log = ON

정답: D
해설: general_log는 모든 쿼리를 기록하는 로그로, 슬로우 쿼리 로그와는 무관함.

8. 아래 중 인덱스를 타지 않는 조건은?
A. WHERE column = 'abc'
B. WHERE column LIKE 'abc%'
C. WHERE column LIKE '%abc'
D. WHERE column BETWEEN 1 AND 10

정답: C
해설: 와일드카드가 앞에 오면 인덱스 사용이 불가능함. %abc는 전체 검색.

9. 다음 중 InnoDB에서 레코드 잠금 충돌을 유발할 가능성이 가장 높은 쿼리는?
A. SELECT ... LOCK IN SHARE MODE
B. UPDATE ... WHERE id = ?
C. SELECT * FROM table WHERE non_indexed_column = ? FOR UPDATE
D. DELETE FROM table WHERE id = ?

정답: C
해설: 인덱스 없는 조건으로 FOR UPDATE를 걸면 레코드 범위가 넓어지고 레코드 잠금 경합 발생 가능성이 높음.

10. MySQL에서 테이블 파티셔닝을 사용할 경우 제한점에 해당하는 것은?
A. 인덱스는 파티션당 하나만 가능
B. 파티션 키는 반드시 PK여야 함
C. 외래 키(FK)를 사용할 수 없음
D. 파티션 키는 AUTO_INCREMENT를 포함해야 함

정답: C
해설: MySQL 파티셔닝은 외래 키 제약조건과 호환되지 않음. 이를 사용하려면 테이블 분할 설계를 고려해야 함.

11. 다음 중 InnoDB에서 Redo Log가 하는 역할로 가장 적절한 것은?
A. 읽기 성능을 높이기 위한 캐시 역할
B. 시스템 크래시 후 복구를 위한 변경 로그
C. 레코드 잠금 정보를 저장
D. 실행 계획을 저장

정답: B
해설: Redo Log는 커밋된 변경 사항을 디스크에 안전하게 쓰기 전에 로그로 먼저 저장하여 장애 복구 가능하게 함 (WAL 방식).

12. MySQL에서 JOIN 순서에 영향을 주는 힌트는?
A. FORCE INDEX
B. STRAIGHT_JOIN
C. USE INDEX
D. LIMIT

정답: B
해설: STRAIGHT_JOIN은 optimizer가 테이블 조인 순서를 최적화하지 않고 작성 순서를 따르도록 강제함.

13. 다음 중 쿼리 성능 저하 원인으로 Handler_read_rnd_next가 비정상적으로 높다는 것은?
A. 트랜잭션이 롤백되는 경우
B. 순차 스캔이 자주 발생
C. 조인이 너무 많음
D. 슬로우 쿼리 로그가 꺼져 있음

정답: B
해설: Handler_read_rnd_next는 테이블의 풀 스캔 횟수를 의미. 인덱스가 없거나 무시될 때 값이 높아짐.

14. ORDER BY + LIMIT 조합 시 성능 병목의 주요 원인은?
A. 정렬할 인덱스가 없어서 전건 정렬
B. LIMIT 때문에 병렬 실행 불가
C. WHERE 조건이 너무 복잡함
D. LIMIT은 항상 메모리를 초과함

정답: A
해설: ORDER BY 컬럼이 인덱스에 없으면 정렬을 위해 임시 테이블을 만들고, 전건 정렬 후 LIMIT 처리 → 매우 느림.

15. InnoDB에서 undo log의 주요 역할은?
A. 장애 복구
B. 커밋 전 데이터 저장
C. MVCC를 위한 이전 버전 유지
D. 인덱스 트리 저장

정답: C
해설: Undo Log는 MVCC를 위해 이전 버전 데이터를 유지하는 데 사용되며, 롤백과 스냅샷 일관성에도 필수적임.

16. 다음 조건에 해당하는 쿼리는 어떤 리스크가 있는가?
sql
복사
편집
WHERE DATE(created_at) = '2024-05-01'
A. 정확히 일치하는 값이므로 인덱스를 잘 탄다
B. 인덱스 컬럼에 함수 사용 시 인덱스가 무시된다
C. DATE 타입은 범위 검색이 느리다
D. 날짜 비교는 쿼리 캐시가 안 된다

정답: B
해설: 인덱스 컬럼에 함수(DATE())를 사용하면 인덱스를 타지 못하고 full scan이 발생함 → BETWEEN 방식으로 바꿔야 함.

17. 다음 중 MySQL의 key buffer는 어느 스토리지 엔진에 관련된 설정인가?
A. InnoDB
B. MyISAM
C. Aria
D. CSV

정답: B
해설: key_buffer_size는 MyISAM에서만 사용되는 인덱스 캐시. InnoDB는 innodb_buffer_pool_size 사용.

18. 다음 중 EXPLAIN 결과에서 Using index 의미로 가장 적절한 것은?
A. 인덱스 스캔 없이 테이블 풀 스캔 중
B. 인덱스 커버링으로 테이블 접근 없이 처리
C. 인덱스 병합이 발생한 상태
D. 인덱스를 사용하지만 임시 테이블도 사용함

정답: B
해설: Using index는 커버링 인덱스 사용을 의미하며, 데이터 레코드에 접근하지 않고 인덱스만으로 처리 가능함.

19. MySQL 8.0에서 JSON 컬럼에 인덱스를 걸기 위한 방법은?
A. JSON 컬럼은 기본적으로 인덱스를 사용할 수 있음
B. FULLTEXT 인덱스를 사용
C. GENERATED COLUMN + VIRTUAL + INDEX
D. JSON 타입에 B-Tree 인덱스 직접 설정

정답: C
해설: JSON 내부 값을 인덱싱하려면 가상 컬럼을 생성한 뒤 해당 컬럼에 인덱스를 설정해야 함.

20. 다음 중 실시간 대용량 트래픽 환경에서 MySQL 병목 분석에 가장 효과적인 도구 조합은?
A. SHOW PROCESSLIST, EXPLAIN, SLOW QUERY LOG
B. SHOW STATUS, SHOW TABLES, mysqldump
C. SHOW WARNINGS, DESCRIBE, mysqladmin
D. myisamchk, innodb_table_monitor, LOAD DATA

정답: A
해설: 프로세스 목록, 실행계획, 슬로우 로그 조합은 트래픽 중 병목 구간 확인에 필수 도구.

