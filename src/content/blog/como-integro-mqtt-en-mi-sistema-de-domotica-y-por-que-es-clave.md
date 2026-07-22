---
title: Cómo integro MQTT en mi sistema de domótica y por qué es clave
description: MQTT es clave para una domótica eficiente, permitiendo una comunicación rápida y escalable entre dispositivos. En este artículo, te cuento cómo lo uso en mi sis
pubDate: '2025-03-18'
category: domotica
tags:
  - mqtt
  - home-assistant
  - iot
---

En un sistema de domótica, la comunicación eficiente entre dispositivos es fundamental para la automatización y el control del hogar inteligente. Uno de los protocolos más utilizados para esta tarea es MQTT, un estándar ligero y flexible que facilita el intercambio de datos entre sensores, actuadores y plataformas como Home Assistant.

## ¿Qué es MQTT y por qué es importante?

MQTT (Message Queuing Telemetry Transport) es un protocolo de mensajería basado en el modelo publicador/suscriptor. Su eficiencia lo hace ideal para entornos con dispositivos IoT, ya que minimiza el consumo de ancho de banda y optimiza la comunicación en redes locales o de baja latencia.

### Ventajas de MQTT en la domótica:

- **Bajo consumo de recursos**: Funciona incluso en microcontroladores con capacidades limitadas.

- **Comunicación en tiempo real**: Garantiza una latencia mínima en la transmisión de datos.

- **Escalabilidad**: Puede manejar desde unos pocos dispositivos hasta redes complejas con cientos de nodos.

- **Compatibilidad**: Se integra con plataformas como Home Assistant y OpenHAB, ofreciendo flexibilidad en la implementación.

- **Fiabilidad**: Utiliza niveles de calidad de servicio (QoS) que garantizan la entrega de mensajes.

- **Seguridad**: Puede configurarse con autenticación y cifrado TLS para proteger la comunicación entre dispositivos.

## Implementación de MQTT en mi sistema de domótica

Para integrar MQTT en mi sistema, utilizo Home Assistant junto con un broker MQTT centralizado. Además, aprovecho Solar Assistant, que incluye su propio broker MQTT, y configuro un puente (bridge) para compartir información entre ambos brokers de manera eficiente. Esto permite que todos los dispositivos puedan comunicarse sin importar a qué servidor MQTT estén conectados.

### 1\. Elección del broker MQTT

El broker actúa como intermediario en la comunicación entre dispositivos. En mi caso, uso **Mosquitto**, una opción ligera y confiable que corre en mi servidor principal, asegurando una comunicación fluida y estable. Otros brokers populares incluyen EMQX, HiveMQ y VerneMQ, cada uno con características específicas que pueden ser útiles en distintas configuraciones.

### 2\. Configuración del broker

Instalé Mosquitto en mi servidor y configuré la autenticación para mejorar la seguridad. Aquí un ejemplo de configuración en `mosquitto.conf`:

```
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
```

```
listener 1883
allow_anonymous false
password_file /etc/mosquitto/passwd
```

Luego, generé credenciales para mis dispositivos. Es importante usar el parámetro `-c` en `mosquitto_passwd` solo la primera vez para evitar sobrescribir usuarios existentes:

```
mosquitto_passwd -c /etc/mosquitto/passwd usuario_mqtt
```

```
mosquitto_passwd -c /etc/mosquitto/passwd usuario_mqtt
```

Utilizo usuarios diferentes para Home Assistant, Zigbee2MQTT y un usuario de "control" para gestión general. También configuré TLS para cifrar las conexiones y evitar interceptaciones.

### 3\. Integración con Home Assistant

Home Assistant permite la configuración de MQTT desde la interfaz gráfica, pero también se puede hacer manualmente en `configuration.yaml`:

```
mqtt:
  broker: 192.168.1.100
  username: usuario_mqtt
  password: clave_secreta
```

```
mqtt:
  broker: 192.168.1.100
  username: usuario_mqtt
  password: clave_secreta
```

Para configurar el broker MQTT en Home Assistant a través de la interfaz de usuario:

1. Ir a **Configuración > Dispositivos y servicios**.

3. Seleccionar **MQTT**.

5. Ingresar el **host**, **puerto**, **usuario** y **contraseña**.

7. Configurar opciones avanzadas como validación de certificados y cliente ID si es necesario.

Si se experimentan errores como `Failed to connect due to exception: [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed`, se recomienda activar las opciones avanzadas y configurar la validación de certificados.

### 4\. Conexión de dispositivos

#### Zigbee2MQTT

La mayoría de mis dispositivos Zigbee se conectan a través de **Zigbee2MQTT (Z2M)**, lo que me permite evitar hubs propietarios y tener mayor independencia en mi sistema. Esto permite recibir y enviar mensajes MQTT directamente desde mis dispositivos Zigbee a Home Assistant, facilitando la automatización y control.

#### ESPHome

Para dispositivos basados en ESP8266 y ESP32, utilizo **ESPHome**, que soporta MQTT y facilita la integración con Home Assistant. Ejemplo de configuración en ESPHome:

```
mqtt:
  broker: 192.168.1.100
  username: usuario_mqtt
  password: clave_secreta
<div></div>
sensor:
  - platform: dht
    model: DHT22
    pin: GPIO4
    temperature:
      name: "Temperatura Exterior"
      state_topic: "casa/exterior/temperatura"
```

```
mqtt:
  broker: 192.168.1.100
  username: usuario_mqtt
  password: clave_secreta

sensor:
  - platform: dht
    model: DHT22
    pin: GPIO4
    temperature:
      name: "Temperatura Exterior"
      state_topic: "casa/exterior/temperatura"
```

De esta manera, los datos de temperatura se envían al servidor MQTT y pueden ser utilizados en Home Assistant para automatizaciones y monitoreo.

### 5\. Automatizaciones en Home Assistant

Las automatizaciones permiten reaccionar a eventos en tiempo real. Por ejemplo, si la temperatura exterior supera los 30°C, un ventilador inteligente se enciende automáticamente:

```
automation:
  - alias: "Encender ventilador por temperatura alta"
    trigger:
      - platform: numeric_state
        entity_id: sensor.temperatura_exterior
        above: 30
    action:
      - service: switch.turn_on
        entity_id: switch.ventilador_exterior
```

```
automation:
  - alias: "Encender ventilador por temperatura alta"
    trigger:
      - platform: numeric_state
        entity_id: sensor.temperatura_exterior
        above: 30
    action:
      - service: switch.turn_on
        entity_id: switch.ventilador_exterior
```

También puedo crear notificaciones automáticas. Si la batería del sistema solar baja de un cierto nivel, puedo recibir una alerta en mi teléfono:

```
automation:
  - alias: "Alerta de batería baja"
    trigger:
      - platform: numeric_state
        entity_id: sensor.bateria_solar
        below: 20
    action:
      - service: notify.mobile_app_mi_telefono
        data:
          title: "⚠️ Alerta de Batería Baja"
          message: "La batería solar ha bajado del 20%. Considera desconectar cargas innecesarias."
```

```
automation:
  - alias: "Alerta de batería baja"
    trigger:
      - platform: numeric_state
        entity_id: sensor.bateria_solar
        below: 20
    action:
      - service: notify.mobile_app_mi_telefono
        data:
          title: "⚠️ Alerta de Batería Baja"
          message: "La batería solar ha bajado del 20%. Considera desconectar cargas innecesarias."
```

Este enfoque optimiza la gestión del hogar, mejorando la eficiencia energética y el confort.

## Conclusión

MQTT es el núcleo de mi sistema de domótica, proporcionando una comunicación fluida y confiable entre dispositivos. Su integración con Home Assistant permite una automatización avanzada y escalable. Además, la combinación con Zigbee2MQTT y ESPHome me da total control sobre mi ecosistema de domótica, sin depender de fabricantes o soluciones propietarias. En definitiva, MQTT es una pieza clave en cualquier instalación de domótica moderna y bien estructurada, garantizando un hogar inteligente más eficiente, seguro y flexible.

¿Has implementado MQTT en tu sistema de domótica? Me encantaría conocer tu experiencia y qué dispositivos usas. Déjame tu comentario y compartamos ideas sobre cómo mejorar nuestras automatizaciones.
