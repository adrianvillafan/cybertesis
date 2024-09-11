import { Body, Container, Head, Heading, Html, Img, Section, Text, Button } from "@react-email/components";
import React from "react";

const logoUrl = "https://vrip.unmsm.edu.pe/wp-content/uploads/2019/09/logo_vrip_footer-150x150.png";
const backgroundImageUrl = "https://es.catalat.org/wp-content/uploads/2019/10/fondo-editorial-unmsm.png";

const TemplateMail = ({ name, message, requestCode }) => {
  const styles = getStyles();

  return React.createElement(
    Html,
    null,
    React.createElement(
      Head,
      null,
      React.createElement('link', {
        href: "https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap",
        rel: "stylesheet"
      })
    ),
    React.createElement(
      Body,
      { style: styles.main },
      React.createElement(
        Container,
        { style: styles.container },
        React.createElement(
          Section,
          { style: styles.headerSection },
          React.createElement(
            'div',
            { style: styles.headerContent },
            React.createElement(Img, {
              src: logoUrl,
              width: "50",
              height: "50",
              alt: "Logo",
              style: styles.logoLeft
            }),
            React.createElement(
              Text,
              { style: styles.headerText },
              "Recepción de Documentos y Títulos en Cybertesis"
            ),
            React.createElement(Img, {
              src: backgroundImageUrl,
              width: "50",
              height: "50",
              alt: "Logo",
              style: styles.logoRight
            })
          )
        ),
        React.createElement(
          Section,
          { style: styles.contentSection },
          React.createElement(
            Heading,
            { style: styles.greeting },
            `Hola, ${name}`
          ),
          React.createElement(
            Text,
            { style: styles.mainText },
            message
          ),
          requestCode &&
          React.createElement(
            React.Fragment,
            null,
            React.createElement(
              Text,
              { style: styles.requestCodeText },
              "Código de Solicitud"
            ),
            React.createElement(
              Heading,
              { style: styles.code },
              requestCode
            )
          ),
          React.createElement(
            Button,
            { style: styles.cloudscapeButton, href: "#" },
            "ENTRAR A MI CUENTA"
          )
        )
      )
    )
  );
};

// Define styles
const getStyles = () => ({
  main: {
    backgroundColor: "#fff",
    color: "#333",
    fontFamily: "'Open Sans', Arial, sans-serif",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
  },
  headerSection: {
    backgroundColor: "#0F1B2A",
    color: "#fff",
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  logoLeft: {
    flexShrink: 0,
    marginRight: "10px",
    marginLeft: "0", 
  },
  headerText: {
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    flexGrow: 1,
    margin: 0,
  },
  logoRight: {
    flexShrink: 0,
    marginLeft: "10px",
    marginRight: "0",
  },
  contentSection: {
    padding: "30px 40px",
    textAlign: "center",
  },
  greeting: {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  mainText: {
    fontSize: "16px",
    color: "#555",
    lineHeight: "1.5",
    marginBottom: "20px",
  },
  requestCodeText: {
    fontSize: "18px",
    color: "#333",
    marginBottom: "5px",
    fontWeight: "bold",
  },
  code: {
    fontSize: "32px",
    color: "#333",
    marginBottom: "30px",
    fontWeight: "bold",
  },
  cloudscapeButton: {
    backgroundColor: "#0073e6",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "25px", // More rounded
    padding: "12px 20px",
    border: "1px solid #005bb5",
    display: "inline-block",
    fontSize: "16px",
    cursor: "pointer",
    fontFamily: "'Open Sans', Arial, sans-serif", // Apply Open Sans font
  }
});

export default TemplateMail;
