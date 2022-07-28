## APIs y Credenciales de acceso
#### Identity Directory Service

Para empezar a usar el api de [Identity Directory Service](https://api.sap.com/api/IdDS_SCIM/resource) ser requiere usar las credenciales las cuales se usan para ingresar al **Identity Authentication Service**, es decir las únicas se requiere las credenciales de una persona que de un administrador de esta consola de administración, estas se tendrán que pasar a base64 debido a que el método de autenticación de esta api es Basic.

#### User Management (System for Cross-domain Identity Management (SCIM))

Para empezar a usa el api [SCIM](https://api.sap.com/api/PlatformAPI/resource) se necesita un "Client ID" y un "Client Secret" debido que el método de autenticación es OAuth 2.0, estos datos como se muestra en la [documentación](https://help.sap.com/docs/BTP/65de2977205c403bbc107264b8eccf4b/ebc9113a520e495ea5fb759b9a7929f2.html?locale=en-US) se obtienen creando una instancia del servicio xsuua con el plan "apiaccess". 

Esta api nos permitirá manejar todo lo relacionado con usuarios, colecciones de roles y demás.


