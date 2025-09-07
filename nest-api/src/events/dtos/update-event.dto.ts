import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsOptional, IsString, Length } from "class-validator";
import { Type } from "class-transformer";

export class UpdateEventDTO {
    @ApiProperty({
        description: 'Título do evento',
        example: 'Meu evento'
    })
    @IsString({
        message: 'O título deve ser uma string',
    })
    @Length(1, 100)
    @IsOptional()
    title?: string;

    @ApiProperty({
        description: 'Descrição do evento',
        example: 'Uma breve descrição do evento'
    })
    @IsString({
        message: 'A descrição deve ser uma string',
    })
    @Length(5, 500)
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Data e hora de início do evento',
        example: '30/09/2025 14:00'
    })
    @IsDate({
        message: 'A data de início deve ser uma data válida',
    })
    @Type(() => Date)
    @IsOptional()
    startDate?: Date;

    @ApiProperty({
        description: 'Data e hora de término do evento',
        example: '30/09/2025 16:00'
    })
    @IsDate({
        message: 'A data de término deve ser uma data válida',
    })
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;

    @ApiProperty({
        description: 'Local do evento',
        example: 'Auditório Principal'
    })
    @IsString({
        message: 'O local deve ser uma string',
    })
    @Length(1, 100)
    @IsOptional()
    location?: string;
}
