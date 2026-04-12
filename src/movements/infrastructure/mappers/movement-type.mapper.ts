import { MovementType as DomainMovementType } from '@movements/domain/entities/movement.entity';
import { MovementType as PrismaMovementType } from '@prisma/client';

/**
 * MovementTypeMapper
 * Mapea entre el enum de dominio y el enum de Prisma
 * Evita casts explícitos "as any"
 */
export class MovementTypeMapper {
  /**
   * Convierte MovementType del dominio a Prisma
   */
  static toPersistence(domainType: string | DomainMovementType): PrismaMovementType {
    if (
      domainType === DomainMovementType.ENTRADA ||
      domainType === 'ENTRADA'
    ) {
      return PrismaMovementType.ENTRADA;
    }
    if (domainType === DomainMovementType.SALIDA || domainType === 'SALIDA') {
      return PrismaMovementType.SALIDA;
    }
    throw new Error(`Invalid movement type: ${domainType}`);
  }

  /**
   * Convierte MovementType de Prisma al dominio
   */
  static toDomain(
    prismaType: PrismaMovementType | string,
  ): DomainMovementType {
    if (prismaType === PrismaMovementType.ENTRADA || prismaType === 'ENTRADA') {
      return DomainMovementType.ENTRADA;
    }
    if (prismaType === PrismaMovementType.SALIDA || prismaType === 'SALIDA') {
      return DomainMovementType.SALIDA;
    }
    throw new Error(`Invalid movement type: ${prismaType}`);
  }

  /**
   * Valida si un valor es un tipo de movimiento válido
   */
  static isValid(value: unknown): boolean {
    return value === 'ENTRADA' || value === 'SALIDA';
  }
}
