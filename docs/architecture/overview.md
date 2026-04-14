# Architecture Overview

## Enfoque General

El sistema sigue una combinación de:

- Arquitectura Hexagonal (Ports & Adapters)
- Domain-Driven Design (DDD)
- Monolito modular

## Objetivos de la arquitectura

- Desacoplar lógica de negocio de frameworks
- Facilitar testing unitario
- Permitir evolución del sistema sin afectar el dominio
- Mantener separación clara de responsabilidades

## Estructura

Cada módulo sigue una arquitectura en capas:

- Domain → lógica de negocio
- Application → casos de uso
- Infrastructure → implementaciones técnicas
- Interface → entrada HTTP

## Estilo de despliegue

- Monolito modular (una sola app)
- Módulos desacoplados por bounded context

## Principios clave

- Dependencias hacia dentro
- Inversión de dependencias
- Separación de responsabilidades
- Dominio independiente de frameworks

## Decisiones clave

Ver ADRs:
- Arquitectura Hexagonal
- DDD
- CQRS (Reports)
- Monolito modular