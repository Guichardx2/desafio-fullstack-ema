import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsString, Length } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventDTO {

    @ApiProperty({
        description: 'Título do evento',
        example: 'Meu evento'
    })
    @IsString({
        message: 'O título deve ser uma string',
    })
    @Length(1, 100, {
        message: 'O título deve conter no máximo 100 caracteres',
    })
    @IsNotEmpty({
        message: 'O título não pode ser vazio',
    })
    title: string;

    @ApiProperty({
        description: 'Descrição do evento',
        example: 'Uma breve descrição do evento'
    })
    @IsString({
        message: 'A descrição deve ser uma string',
    })
    @IsNotEmpty({
        message: 'A descrição não pode ser vazia',
    })
    @Length(5, 500, {
        message: 'A descrição deve conter pelo menos 5 caracteres e no máximo 500',
    })
    description: string;

    @ApiProperty({
        description: 'Data e hora de início do evento',
        example: '30/09/2025 14:00'
    })
    @IsDate({
        message: 'A data de início deve ser uma data válida',
    })
    @Type(() => Date)
    @IsNotEmpty({
        message: 'A data de início não pode ser vazia',
    })
    startDate: Date;

    @ApiProperty({
        description: 'Data e hora de término do evento',
        example: '30/09/2025 16:00'
    })
    @IsDate({
        message: 'A data de término deve ser uma data válida',
    })
    @Type(() => Date)
    @IsNotEmpty({
        message: 'A data de término não pode ser vazia',
    })
    endDate: Date;

    @ApiProperty({
        description: 'Local do evento',
        example: 'Auditório Principal'
    })
    @IsString({
        message: 'O local deve ser uma string',
    })
    @IsNotEmpty({
        message: 'O local não pode ser vazio',
    })
    @Length(1, 100, {
        message: 'O local deve conter no máximo 100 caracteres',
    })
    location: string;
}
