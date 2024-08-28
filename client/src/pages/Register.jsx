import { useContext } from "react";
import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUserFn,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);
  return (
    <div>
      <Form onSubmit={registerUserFn}>
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={5}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                type="text"
                required
                placeholder="Name"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, name: e.target.value })
                }
                style={{ paddingTop: "14px", paddingBottom: "14px" }}
              />
              <Form.Control
                type="email"
                required
                placeholder="Email"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
                style={{ paddingTop: "14px", paddingBottom: "14px" }}
              />
              <Form.Control
                type="password"
                required
                placeholder="Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
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
                }}
              >
                {isRegisterLoading ? "Loading" : "Register"}
              </Button>

              <Link to="/login" style={{ textAlign: "center" }}>
                <p>Login </p>
              </Link>
              {registerError?.error && (
                <Alert
                  variant="danger"
                  style={{
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <p>{registerError.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Register;
