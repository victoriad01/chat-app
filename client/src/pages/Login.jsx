import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    updateLoginInfo,
    loginInfo,
    loginError,
    isLoginLoading,
    loginUserFn,
  } = useContext(AuthContext);
  return (
    <div>
      <Form onSubmit={loginUserFn}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={5}>
            <Stack gap={3}>
              <h2>Login</h2>
              <Form.Control
                type="email"
                required
                placeholder="Email"
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
                style={{ paddingTop: "14px", paddingBottom: "14px" }}
              />
              <Form.Control
                type="password"
                required
                placeholder="Password"
                onChange={(e) =>
                  updateLoginInfo({
                    ...loginInfo,
                    password: e.target.value,
                  })
                }
                style={{ paddingTop: "14px", paddingBottom: "14px" }}
              />
              <Button
                variant="primary"
                type="submit"
                style={{
                  paddingTop: "12px",
                  paddingBottom: "12px",
                  background: "##FF9D63",
                }}
              >
                {isLoginLoading ? "Getting you in..." : "Login"}
              </Button>
              <Link to="/register" style={{ textAlign: "center" }}>
                <p>Sign up</p>
              </Link>

              {loginError?.error && (
                <Alert
                  variant="danger"
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <p>{loginError.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Login;
