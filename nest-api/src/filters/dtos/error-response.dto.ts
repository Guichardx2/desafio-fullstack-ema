import { IsBoolean, IsDate, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ErrorResponseDTO {
    @ApiProperty({ description: "Indicates if the request was successful", example: false, type: Boolean })
    @IsBoolean()
    success: boolean = false;

    @ApiProperty({ description: "The status of the response", example: "404", type: String })
    @IsString()
    status: number;

    @ApiProperty({ description: "The error message", example: "User not found", type: String })
    @IsString()
    message: string;

    @ApiProperty({ description: "The error path", example: "app/code/service.ts", type: String })
    @IsString()
    path: string

    @ApiProperty({ description: "The timestamp of the error", example: "2023-10-01T12:00:00Z", type: Date })
    @IsDate()
    timestamp: Date;

    constructor(status: number, message: string, path: string) {
        this.status = status;
        this.message = message;
        this.path = path;
        
        this.timestamp = new Date();
    }
}