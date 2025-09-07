import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class SuccessResponseDTO<T = any> {

    @ApiProperty({ description: "Indicates if the request was successful", type: Boolean, default: true })
    @IsBoolean()
    success: boolean = true;

    @ApiProperty({ description: "The status of the response", type: String })
    @IsString()
    status: number;

    @ApiProperty({ description: "The success message", type: String })
    @IsString()
    message?: string;

    @ApiProperty({ description: "Returns the object data if provided", type: Object })
    @IsOptional()
    data?: T;

    @ApiProperty({ description: "The timestamp of the success", type: Date })
    @IsDate()
    timestamp: Date;

    constructor(status: number, data?: T, message?: string) {
        this.status = status;
        this.data = data;
        this.message = message;
        this.timestamp = new Date();
    }
}