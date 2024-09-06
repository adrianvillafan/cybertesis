import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Section,
  Text,
  Button,
} from "@react-email/components";
import React from "react";

const logoUrl = "https://vrip.unmsm.edu.pe/wp-content/uploads/2019/09/logo_vrip_footer-150x150.png";
const backgroundImageUrl = "https://es.catalat.org/wp-content/uploads/2019/10/fondo-editorial-unmsm.png";

export default function templateMail({ name, message, requestCode }) {
  return (
    <Html>
      <Head />
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Section style={styles.headerSection}>
            <div style={styles.headerContent}>
              <Img
                src={logoUrl}
                width="50"
                height="50"
                alt="Logo"
                style={styles.logo}
              />
              <Text style={styles.headerText}>
                Recepción de Documentos y Títulos en Cybertesis
              </Text>
              <Img
                src={backgroundImageUrl}
                width="70"
                height="40"
                alt="Background"
                style={styles.background}
              />
            </div>
          </Section>
          <Section style={styles.contentSection}>
            <Heading style={styles.greeting}>Hola, {name}</Heading>
            <Text style={styles.mainText}>{message}</Text>

            {requestCode && (
              <>
                <Text style={styles.requestCodeText}>Código de Solicitud</Text>
                <Heading style={styles.code}>{requestCode}</Heading>
              </>
            )}

            <Button style={styles.cloudscapeButton} href="#">
              ENTRAR A MI CUENTA
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Define styles
const styles = {
  main: { backgroundColor: "#fff", color: "#333", fontFamily: "Arial, sans-serif" },  // Fondo blanco
  container: { width: "100%", maxWidth: "600px", margin: "0 auto", backgroundColor: "#fff", borderRadius: "10px", overflow: "hidden" },  // Fondo blanco
  headerSection: { backgroundColor: "#0F1B2A", color: "#fff", padding: "20px 20px 10px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },  // Ajuste de padding
  headerContent: { display: "flex", alignItems: "center", justifyContent: "center", width: "100%" },
  logo: { marginRight: "10px", marginBottom: "10px" },
  headerText: { textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#fff", margin: 0, paddingTop: "10px" },  // Ajuste de padding
  background: { marginLeft: "10px", marginBottom: "10px" },
  contentSection: { padding: "30px 40px", textAlign: "center" },
  greeting: { color: "#333", fontSize: "24px", fontWeight: "bold", marginBottom: "15px" },
  mainText: { fontSize: "16px", color: "#555", lineHeight: "1.5", marginBottom: "20px" },
  requestCodeText: { fontSize: "18px", color: "#333", marginBottom: "5px", fontWeight: "bold" },
  code: { fontSize: "32px", color: "#333", marginBottom: "30px", fontWeight: "bold" },
  cloudscapeButton: { 
    backgroundColor: "#0073e6", 
    color: "#fff", 
    textDecoration: "none", 
    borderRadius: "5px", 
    padding: "12px 20px", 
    border: "1px solid #005bb5", 
    display: "inline-block", 
    fontSize: "16px",
    cursor: "pointer",
  }, 
};
