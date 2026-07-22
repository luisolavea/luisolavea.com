---
title: 'Automatizando luces y sensores con Home Assistant: Ejemplos prácticos'
description: 'Home Assistant es una potente plataforma de automatización del hogar que permite integrar luces y sensores de diferentes tecnologías como Zigbee, WiFi y Z-Wave '
pubDate: '2025-02-19'
category: domotica
tags:
  - home-assistant
  - automatizacion
  - luces
---

**Home Assistant** es una de las plataformas de automatización del hogar más potentes y flexibles, permitiendo la integración de una amplia variedad de dispositivos. Se trata de un software de código abierto que se ejecuta localmente, sin depender de la nube, lo que garantiza un mayor control sobre la privacidad y la seguridad de los datos.

Esta plataforma es compatible con miles de dispositivos de diferentes marcas y protocolos como WiFi, Zigbee, Z-Wave y Bluetooth, lo que permite crear automatizaciones avanzadas para mejorar la eficiencia energética y la comodidad del hogar. Además, Home Assistant ofrece una interfaz intuitiva y la posibilidad de personalizar su funcionamiento mediante YAML o Node-RED, lo que lo hace accesible tanto para principiantes como para usuarios avanzados.

En este artículo, exploraremos ejemplos prácticos para automatizar luces y sensores, optimizando el consumo energético y mejorando la comodidad en el hogar.

## **Integración de luces en Home Assistant**

Existen diferentes formas de integrar luces en Home Assistant, dependiendo del tipo de dispositivo que se utilice. Las opciones más comunes incluyen:

- **Ampolletas inteligentes**, que se conectan directamente a la red WiFi o a un hub Zigbee/Z-Wave.

- **Interruptores inteligentes**, que permiten controlar una lámpara o circuito de luces sin necesidad de cambiar las ampolletas.

- **Relés inteligentes**, que pueden instalarse en cajas de conexiones o dentro de luminarias para convertir cualquier lámpara en inteligente.

En mi caso, utilizo:

- **Relés Zigbee** para algunas lámparas, como la lámpara de techo del living y las luces de la escalera.

- **Ampolletas Zigbee** de diferentes marcas, todas utilizando Tuya.

- **Ampolletas y downlights WiFi** de Xiaomi, integrados en Home Assistant mediante la integración **Xiaomi Miot Auto**.

Una vez integradas, las luces aparecen en el dashboard de Home Assistant y pueden ser controladas manualmente o mediante automatizaciones.

## **Sensores en Home Assistant: Movimiento y magnéticos**

Además de las luces, los sensores juegan un papel clave en la automatización del hogar. Entre los más utilizados están los sensores de movimiento y los sensores magnéticos, que permiten activar dispositivos en función de la detección de presencia o el estado de puertas y ventanas.

### **Sensores de movimiento**

Los sensores de movimiento permiten encender luces, activar alarmas o notificaciones cuando detectan presencia. Existen diferentes tipos según su tecnología:

- **WiFi**: Fáciles de configurar pero con mayor consumo de energía y dependencia de la red.

- **Zigbee**: Bajo consumo energético y respuesta rápida, ideal para integraciones locales sin depender de la nube.

- **Z-Wave**: Similar a Zigbee, pero con un protocolo diferente y frecuencias variables según la región.

- **Bluetooth**: Generalmente usados en dispositivos portátiles o soluciones de corto alcance.

En mi caso, utilizo exclusivamente **sensores de movimiento Zigbee**, todos gestionados a través de **Zigbee2MQTT**, lo que me permite integrarlos fácilmente en Home Assistant sin necesidad de depender de plataformas de terceros.

### **Sensores magnéticos**

Los sensores magnéticos detectan la apertura o cierre de puertas y ventanas, lo que permite automatizar diferentes acciones. Son muy útiles para la iluminación, por ejemplo:

- **Encender las luces del pasillo exterior al abrir la puerta principal por la noche.**

- **Activar luces en un armario o despensa al abrir la puerta.**

- **Apagar la calefacción o el aire acondicionado si se abre una ventana.**

Al igual que los sensores de movimiento, los sensores magnéticos pueden ser de diferentes tecnologías (WiFi, Zigbee, Z-Wave, etc.). En mi instalación, utilizo sensores Zigbee, que integran rápidamente con mi sistema mediante Zigbee2MQTT.

## **Automatizaciones de luces en Home Assistant**

### **Encender luces con sensor de movimiento**

Una de las automatizaciones más comunes es encender las luces cuando se detecta movimiento y apagarlas tras un tiempo sin detección.

```
alias: Encender luces por movimiento
trigger:
  - platform: state
    entity_id: binary_sensor.sensor_movimiento
    to: "on"
condition: []
action:
  - service: light.turn_on
    target:
      entity_id: light.luz_hall
  - delay: "00:02:00"
  - service: light.turn_off
    target:
      entity_id: light.luz_hall
mode: restart
```

```
alias: Encender luces por movimiento
trigger:
  - platform: state
    entity_id: binary_sensor.sensor_movimiento
    to: "on"
condition: []
action:
  - service: light.turn_on
    target:
      entity_id: light.luz_hall
  - delay: "00:02:00"
  - service: light.turn_off
    target:
      entity_id: light.luz_hall
mode: restart
```

**Explicación:**

- Se activa cuando el sensor de movimiento detecta presencia.

- Enciende la luz del hall.

- Se apaga la luz tras 2 minutos sin detección.

- `mode: restart` asegura que si hay movimiento repetido, el temporizador se reinicie.

### **Encender luces del pasillo con movimiento**

Otra automatización útil es encender las luces del pasillo solo cuando el sol está bajo y se detecta movimiento:

```
alias: Encender Luces del pasillo
triggers:
  - platform: state
    entity_id: binary_sensor.ocupacion_pasillo
    to: "on"
conditions:
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    below: 5
actions:
  - service: light.turn_on
    target:
      entity_id: light.pasillo
  - wait_for_trigger:
      - platform: state
        entity_id: binary_sensor.ocupacion_pasillo
        to: "off"
  - service: light.turn_off
    target:
      entity_id: light.pasillo
mode: restart
```

```
alias: Encender Luces del pasillo
triggers:
  - platform: state
    entity_id: binary_sensor.ocupacion_pasillo
    to: "on"
conditions:
  - condition: numeric_state
    entity_id: sun.sun
    attribute: elevation
    below: 5
actions:
  - service: light.turn_on
    target:
      entity_id: light.pasillo
  - wait_for_trigger:
      - platform: state
        entity_id: binary_sensor.ocupacion_pasillo
        to: "off"
  - service: light.turn_off
    target:
      entity_id: light.pasillo
mode: restart
```

**Explicación:**

- Se activan las luces del pasillo cuando hay movimiento y el sol está bajo.

- Las luces se mantienen encendidas mientras haya movimiento.

- Se apagan cuando ya no se detecta movimiento.

### **Encender luces con sensor magnético**

Si se abre la puerta principal, se encienden las luces exteriores si es de noche:

```
alias: Encender luces del pasillo exterior
trigger:
  - platform: state
    entity_id: binary_sensor.puerta_principal
    to: "on"
condition:
  - condition: sun
    after: sunset
    before: sunrise
action:
  - service: light.turn_on
    target:
      entity_id: light.pasillo_exterior
  - delay: "00:05:00"
  - service: light.turn_off
    target:
      entity_id: light.pasillo_exterior
mode: single
```

```
alias: Encender luces del pasillo exterior
trigger:
  - platform: state
    entity_id: binary_sensor.puerta_principal
    to: "on"
condition:
  - condition: sun
    after: sunset
    before: sunrise
action:
  - service: light.turn_on
    target:
      entity_id: light.pasillo_exterior
  - delay: "00:05:00"
  - service: light.turn_off
    target:
      entity_id: light.pasillo_exterior
mode: single
```

**Explicación:**

- La automatización se activa cuando el sensor magnético de la puerta principal detecta que está abierta.

- Antes de encender la luz, verifica si es de noche.

- Si la condición se cumple, enciende la luz del pasillo exterior.

- Luego, espera 5 minutos y apaga la luz automáticamente.

### **Encendido basado en horario**

Si se desea encender luces automáticamente al atardecer:

```
alias: Encender luces al atardecer
trigger:
  - platform: sun
    event: sunset
action:
  - service: light.turn_on
    target:
      entity_id: light.salon
mode: single
```

```
alias: Encender luces al atardecer
trigger:
  - platform: sun
    event: sunset
action:
  - service: light.turn_on
    target:
      entity_id: light.salon
mode: single
```

**Explicación:**

- La automatización se activa cuando el sol se pone (`event: sunset`).

- Enciende automáticamente la luz del salón al atardecer.

- No tiene condición, por lo que siempre se ejecutará a esa hora.

### **Simulación de presencia**

Para encender y apagar luces aleatoriamente cuando no hay nadie en casa:

```
alias: Simulación de presencia
trigger:
  - platform: time_pattern
    minutes: "/15"
condition:
  - condition: state
    entity_id: group.familia
    state: "not_home"
action:
  - service: light.toggle
    target:
      entity_id: light.salon
mode: single
```

```
alias: Simulación de presencia
trigger:
  - platform: time_pattern
    minutes: "/15"
condition:
  - condition: state
    entity_id: group.familia
    state: "not_home"
action:
  - service: light.toggle
    target:
      entity_id: light.salon
mode: single
```

**Explicación:**

- Se ejecuta cada 15 minutos (minutes: "/15") para hacer cambios en la iluminación.

- Primero verifica que nadie está en casa (`group.familia` debe estar en "not\_home").

- Si la condición se cumple, alterna (`toggle`) el estado de la luz del salón, encendiéndola o apagándola de manera intermitente.

- Esto simula la presencia de personas en casa, ayudando a disuadir intrusos.

## **Conclusión**

Home Assistant permite una personalización avanzada en la automatización de luces y sensores. Desde encender luces con movimiento hasta ajustar la iluminación según la hora del día o simular presencia, las posibilidades son infinitas.

Si prefieres una alternativa más visual, Home Assistant también permite crear automatizaciones desde su dashboard sin necesidad de escribir código. Este método será abordado en otro artículo o tutorial. Además, las mismas automatizaciones pueden realizarse con **Node-Red**, proporcionando aún más flexibilidad en la integración de dispositivos.

Si tienes dudas o sugerencias, ¡déjalas en los comentarios!
