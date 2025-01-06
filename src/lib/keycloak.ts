// lib/keycloak.js
import Keycloak from "keycloak-js";

let keycloak: any;

const getKeycloakInstance = () => {
	if (!keycloak) {
		keycloak = new Keycloak({
			url: "http://localhost:8080/",
			realm: "internal-ftp",
			clientId: "ftp-system",
		});
	}
	return keycloak;
};

export default getKeycloakInstance;
