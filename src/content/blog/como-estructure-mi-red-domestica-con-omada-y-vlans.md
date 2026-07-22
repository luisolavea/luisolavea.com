---
title: Cómo estructuré mi red doméstica con Omada y VLANs
description: Desde que implementé Omada en mi red doméstica, he logrado mejorar significativamente la organización, seguridad y rendimiento de mis dispositivos conectados. A
pubDate: '2025-02-11'
category: tecnologia
tags:
  - red
  - omada
  - wifi
  - redes
  - tp-link
---

Desde que implementé Omada en mi red doméstica, he logrado mejorar significativamente la organización, seguridad y rendimiento de mis dispositivos conectados. Anteriormente utilizaba un **Xiaomi Mi Router 4A Gigabit Edition**, que si bien funcionaba bien para un entorno con pocos dispositivos, se quedó corto con el crecimiento de mi infraestructura doméstica, especialmente en domótica y mi homelab. Con el aumento constante de dispositivos conectados, tanto alámbricos como inalámbricos, su rendimiento comenzó a degradarse, ocasionando problemas de estabilidad y limitaciones en la segmentación de la red.

Esto me llevó a migrar a un **TP-Link ER-605**, un router compatible con el ecosistema Omada, que permite una gestión centralizada, un mejor control del tráfico y el uso de VLANs para segmentar la red de manera eficiente. Con esta nueva infraestructura, he podido mejorar la administración de la red, optimizar el rendimiento y reforzar la seguridad. Además, dado que muchos dispositivos WiFi de domótica podrían presentar vulnerabilidades de seguridad, la segmentación con VLANs ayuda a aislar estos dispositivos de las redes principales, reduciendo así los posibles riesgos.

## **Mi configuración actual con Omada**

Actualmente, utilizo el **Controlador Omada en su versión por software**, aunque existen versiones en hardware. Este controlador me permite administrar la red de manera centralizada, aplicar políticas de seguridad, monitorear el tráfico y optimizar la conectividad según las necesidades de cada dispositivo.

Mis puntos de acceso proporcionan **WiFi N**, lo cual no representa un problema, ya que la mayoría de mis dispositivos WiFi solo soportan este tipo de conexión. También, la mayoría de los dispositivos que requieren un mayor ancho de banda, como los televisores y las cámaras de exterior, están conectados por cable para asegurar un rendimiento óptimo y evitar congestión en la red inalámbrica.

### **VLANs en uso**

Para organizar mis dispositivos de manera eficiente, he definido las siguientes VLANs:

- **VLAN 10 - Domótica** → Contiene todos los dispositivos inteligentes del hogar, como sensores, interruptores, bombillas y asistentes de voz.

- **VLAN 20 - Dispositivos Personales** → Destinada a teléfonos, tablets, computadores y otros dispositivos de uso personal.

- **VLAN 30 - Seguridad** → Incluye cámaras de vigilancia y sistemas de monitoreo. **No tiene acceso a internet** por seguridad, gracias a una regla ACL en el router.

- **VLAN 40 - Invitados** → Una red completamente aislada para visitas, asegurando que no tengan acceso a otros dispositivos.

- **VLAN 1 - Servidores e infraestructura de red** → Maneja servidores, el controlador Omada y otros dispositivos críticos de la red. **No tiene una red WiFi asignada**.

Cada VLAN tiene su propia red WiFi, **excepto la VLAN 1**, que se mantiene exclusiva para la infraestructura cableada. Esto garantiza que la red de administración y la infraestructura crítica se mantengan aisladas y protegidas, evitando accesos no autorizados y posibles interferencias.

## **Topología de la red**

- **El internet llega a través de un plato de Starlink (Gen 1)**, conectado directamente al **ER-605**.

- El **ER-605** se conecta al **switch SG-2008**, que actúa como el switch principal de la red.

- Desde el **SG-2008** se conectan:
    - **3 Puntos de acceso EAP-115**, que proporcionan redes WiFi separadas según cada VLAN.
    
    - **2 Switches Mercusys MS-108G**:
        - **MS-108G en VLAN 30** → Conectado a **3 cámaras domo**, un **NVR**
        
        - **MS-108G en VLAN 10** → Conectado a **3 televisores Android**.
    
    - **Servidor Proxmox**, que aloja varias máquinas virtuales y contenedores en diferentes VLAN.
    
    - **Mi PC de escritorio**, usada para tareas diarias y administración de la red.

- En WiFi, se conectan diversos dispositivos según la VLAN asignada:
    - **VLAN 10 (Domótica)** → Sensores, interruptores, bombillas, dispositivos Google Home y otros equipos inteligentes.
    
    - **VLAN 20 (Dispositivos personales)** → Smartphones, tablets y computadoras de uso diario.
    
    - **VLAN 40 (Invitados)** → Dispositivos de visitas y conexiones temporales.
    
    - **VLAN 30 (Seguridad)** → Algunas cámaras WiFi, también sin acceso a internet mediante ACL.

![](https://luisolavea.com/wp-content/uploads/2025/08/topologia-red.svg)

## **Beneficios de esta estructura**

- **Mayor seguridad**: Los dispositivos de domótica y seguridad están aislados de la red personal e invitados, evitando accesos no autorizados.

- **Mejor administración**: Puedo aplicar reglas específicas para cada segmento de la red sin afectar otros dispositivos.

- **Rendimiento optimizado**: La segmentación evita la saturación de la red y garantiza un mejor desempeño para cada grupo de dispositivos.

- **Facilidad de escalabilidad**: La configuración permite agregar nuevos dispositivos o redes sin comprometer la estabilidad del sistema.

## **Conclusión**

Implementar Omada y segmentar mi red con VLANs ha sido una de las mejores decisiones para mejorar la estabilidad, seguridad y rendimiento de mi infraestructura doméstica. Gracias a la gestión centralizada y las reglas ACL, he podido optimizar la comunicación entre dispositivos, restringir accesos y evitar problemas de congestión. Aunque podría beneficiarme del WiFi AC o AX en algunos dispositivos, en la práctica no he notado diferencias significativas en mi uso diario. En definitiva, esta configuración me permite mantener una red eficiente, escalable y segura para el futuro.

Si tienes dudas, experiencias similares o sugerencias, te invito a compartirlas en la sección de comentarios. ¡Será interesante intercambiar ideas sobre este tipo de configuraciones!
