---
title: 'Homelab en casa: Mi configuración actual y consejos para empezar'
description: 'Un homelab permite gestionar servidores y redes en casa para aprendizaje y control de servicios. Comparto mi configuración con Proxmox, Omada, Home Assistant y '
pubDate: '2025-03-04'
category: tecnologia
tags:
  - homelab
  - hp
  - servidores
  - tp-link
---

Si te apasiona la tecnología y quieres tener control total sobre tus servicios digitales, un homelab puede ser la solución ideal. No solo te permitirá gestionar tus propios servidores y redes, sino que también será una excelente forma de aprendizaje. En este artículo, compartiré mi configuración actual y algunos consejos para quienes quieran iniciarse en el mundo del homelab.

### ¿Qué es un Homelab?

Un homelab es un laboratorio casero donde puedes experimentar con servidores, redes y software sin afectar un entorno de producción. Es un espacio donde los entusiastas de la tecnología y profesionales de IT pueden probar nuevas configuraciones, aprender sobre administración de sistemas y mejorar la infraestructura digital del hogar sin riesgos.

Su flexibilidad permite alojar aplicaciones web, servidores de medios, entornos de pruebas o incluso sistemas de automatización del hogar. Dependiendo de las necesidades y el presupuesto, un homelab puede ser tan simple como una Raspberry Pi corriendo algunos servicios o tan complejo como un rack de servidores con máquinas virtuales y almacenamiento en red.

Algunas de las razones por las que las personas montan un homelab incluyen:

-   **Aprendizaje y experimentación:** Ideal para probar nuevas tecnologías sin afectar sistemas de producción.
-   **Alojamiento de servicios propios:** Puedes correr aplicaciones como servidores web, VPNs, almacenamiento en la nube personal y domótica.
-   **Seguridad y privacidad:** Mantener control total sobre tus datos y evitar depender de servicios de terceros.
-   **Optimización de costos:** Algunas soluciones en la nube pueden ser costosas; un homelab bien gestionado puede reducir costos a largo plazo.

Tener un homelab te permite desarrollar habilidades prácticas en administración de sistemas, redes y seguridad informática, lo que puede ser útil tanto a nivel personal como profesional.

### Mi configuración actual

En mi caso, he ido evolucionando mi homelab con el tiempo, optimizándolo para mis necesidades actuales. A continuación, detallo los principales componentes de mi setup, organizados por categorías.

#### **Red y conectividad**

-   **Router**: TP-Link ER-605, encargado de gestionar el tráfico y las VLANs.
-   **Switch principal**: TP-Link SG2008, para distribuir la conectividad de manera eficiente.
-   **Switch secundario**: Mercusys MS-108G (para los Smart TV), asegurando conectividad estable para streaming.
-   **Puntos de acceso WiFi**: 3x EAP-115, configurados en Omada para una cobertura estable y segmentada.
-   **Controlador de red**: TP-Link Omada (versión software), centralizando la gestión de los dispositivos.
-   **VLANs configuradas**: Para segmentar el tráfico de IoT, cámaras de seguridad y red principal, mejorando la seguridad y el rendimiento.
-   **Conexión a Internet**: Antena Starlink Gen 1, proporcionando acceso a internet estable y de alta velocidad.

#### **Servidores y almacenamiento**

-   **Servidor Principal**: PC armado con procesador Intel Pentium Gold G5400, 24 GB de RAM, 2 SSD de 240 GB y 2 HDD de 2 TB, corriendo Proxmox con varios contenedores LXC.
-   **NVR dedicado**: Xmeye con disco de 1 TB, ahora conectado directamente al switch principal.
-   **Integración de cámaras**: Mediante go2rtc y protocolos DVRIP y ONVIF, asegurando compatibilidad con múltiples marcas y modelos.
-   **Servidor DNS Secundario**: Laptop HP 14-ac136la con Ubuntu, funcionando como respaldo del DNS principal.
-   **Orange Pi 3 LTS**: Corriendo Solar Assistant para monitoreo y análisis del sistema solar.
-   **Impresora 3D**: Flsun Q5, utilizada para prototipado y proyectos de impresión.

#### **Monitoreo y gestión**

-   **Home Assistant**: Integrado con múltiples dispositivos para automatización del hogar y monitoreo del consumo energético.
-   **Uptime Kuma**: Seguimiento del estado de los servicios autoalojados y notificaciones en caso de caída.
-   **Tailscale**: VPN para acceso seguro a la red desde cualquier lugar sin necesidad de abrir puertos en el router.
-   **Cloudflare Tunnels**: Para exponer servicios selectivos sin comprometer la seguridad de la red.

### Consejos para empezar con un homelab

Si estás pensando en montar tu propio homelab, aquí tienes algunos consejos útiles para que el proceso sea lo más sencillo y efectivo posible.

#### 1\. **Define tus objetivos**

Antes de comprar hardware, piensa qué quieres lograr con tu homelab. ¿Necesitas almacenamiento centralizado? ¿Quieres aprender sobre redes? ¿Planeas alojar servicios para domótica? Responder estas preguntas te ayudará a evitar compras innecesarias y a estructurar mejor tu instalación.

#### 2\. **Empieza con lo que tienes**

No es necesario invertir en hardware costoso de inmediato. Un viejo PC o una Raspberry Pi pueden ser suficientes para empezar a experimentar. Si tienes algún NAS o router con capacidades avanzadas, también pueden formar parte de tu homelab.

#### 3\. **Asegura una buena red**

Un homelab eficiente necesita una red bien configurada. Considera usar VLANs para segmentar el tráfico y evitar problemas de congestión o seguridad. Una mala configuración de red puede generar cuellos de botella y vulnerabilidades, así que asegúrate de investigar antes de implementarlas.

#### 4\. **Automatiza y documenta todo**

Usa herramientas como Ansible o Docker para facilitar la gestión de tus servicios. Además, documenta tu configuración para futuras referencias (yo utilizo Obsidian para esto). Tener una buena documentación te permitirá solucionar problemas rápidamente y replicar configuraciones sin esfuerzo.

#### 5\. **Mantén la seguridad en mente**

Si expones servicios a internet, usa firewalls, VPNs y autenticación fuerte para evitar accesos no autorizados. Además, considera el uso de proxys inversos como Nginx Proxy Manager para gestionar el acceso a los servicios de manera más segura. En mi caso, utilizo túneles de Cloudflare para servicios puntuales y Tailscale como VPN para acceder a mi red de forma segura.

#### 6\. **Planifica la escalabilidad**

A medida que tu homelab crezca, necesitarás pensar en cómo escalarlo. Puede ser desde mejorar la red con switches gestionados hasta añadir más almacenamiento. Planificar esto con anticipación te evitará problemas cuando necesites hacer mejoras.

### Conclusión

Tener un homelab es una excelente forma de aprender y optimizar la tecnología en casa. Con planificación y paciencia, puedes construir un entorno potente y adaptado a tus necesidades. ¡Comparte tu experiencia en los comentarios!
