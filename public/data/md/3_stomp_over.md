1. WebSocket의 유저 식별 및 메시지 전송 방식에 대한 설명 중 틀린 것은?
A. STOMP에서는 특정 사용자에게 메시지를 보내기 위해 convertAndSendToUser() 메서드를 사용함
B. STOMP에서 /user/{username}/destination 형태로 메시지가 전송됨
C. convertAndSendToUser()는 구독 없이도 사용자에게 메시지를 보낼 수 있음
D. 클라이언트는 /user/queue/private 같은 경로를 사전에 구독해야 메시지를 받을 수 있음

정답: C
해설: convertAndSendToUser()를 통해 메시지를 보내려면 클라이언트가 해당 목적지를 반드시 구독하고 있어야 함. 구독 없이 메시지는 전달되지 않음.
출제의도: 사용자 대상 메시징에서 구독의 중요성을 인지하고 있는지 확인.

2. Spring WebSocket에서 유저 인증 정보를 활용한 메시징 방식에 대한 설명 중 틀린 것은?
A. WebSocket 연결 시 인증된 사용자 정보를 기반으로 메시지를 라우팅할 수 있음
B. 인증 정보는 HTTP 요청 헤더를 통해 자동으로 WebSocket 세션에 전달됨
C. 인증된 사용자 식별은 Principal 객체로부터 파악할 수 있음
D. 클라이언트 연결 시 인증 처리 로직은 configureClientInboundChannel()에서 처리 가능함

정답: B
해설: WebSocket은 일반 HTTP 요청처럼 헤더 기반 인증을 그대로 사용할 수 없기 때문에, 커스텀 핸드셰이크 처리나 세션 인증 연동이 필요함.
출제의도: WebSocket의 인증 흐름과 HTTP 요청과의 차이를 정확히 구분할 수 있는지 확인.

3. WebSocket 확장 구조에서 SimpleBroker의 한계에 대한 설명 중 틀린 것은?
A. SimpleBroker는 모든 연결과 메시지를 서버 메모리로 관리함
B. SimpleBroker는 외부 브로커(RabbitMQ 등)와 연동하여 수평 확장을 지원함
C. SimpleBroker는 서버 장애 시 모든 연결이 끊길 수 있음
D. SimpleBroker는 수많은 연결을 처리하기엔 자원 관리가 비효율적일 수 있음

정답: B
해설: SimpleBroker는 외부 브로커와의 연동을 지원하지 않음. 외부 브로커를 사용하려면 STOMP Relay Broker 구성을 따로 해야 함.
출제의도: WebSocket 메시징 구조에서 내부 브로커 vs 외부 브로커의 역할 차이를 이해했는지 확인.

4. WebSocket의 리소스 소비 구조에 대한 설명 중 틀린 것은?
A. 웹소켓 연결마다 서버의 메모리, FD(File Descriptor), CPU 리소스를 소모함
B. 서버 스케일링은 수직 확장보다 수평 확장이 더 안정적인 구조를 제공함
C. 클라이언트 1명당 웹소켓 연결은 서버 스레드 1개와 FD 1개를 소모함
D. 동시 접속 수 증가 시, 서버는 모든 메시지를 클라이언트에게 직접 전송하지 않아도 됨

정답: D
해설: 서버는 각 연결된 클라이언트에게 직접 전송해야 하며, 연결이 유지된 상태로 메시지를 전송해야 함. 브로커 구조로 분산은 가능하지만 직접 송신 책임은 남음.
출제의도: 웹소켓의 실제 운영 리소스 소모 구조를 이해하고 있는지 평가.

5. Spring에서 WebSocket 1:1 메시징 기능 구현 방식에 대한 설명 중 틀린 것은?
A. 클라이언트는 특정 /user/queue/private 경로를 구독해야 메시지를 받을 수 있음
B. 서버는 convertAndSendToUser(username, "/queue/private", message)로 메시지를 전송함
C. 클라이언트가 접속만 하면 자동으로 메시지를 받을 수 있도록 브로커가 구독을 대신함
D. 인증된 사용자 이름은 Principal.getName()을 통해 식별할 수 있음

정답: C
해설: 브로커는 자동으로 구독을 설정해주지 않음. 클라이언트가 명시적으로 subscribe 요청을 보내야만 메시지를 수신할 수 있음.
출제의도: WebSocket의 1:1 라우팅 구조와 클라이언트의 역할에 대해 제대로 이해하고 있는지 점검.

