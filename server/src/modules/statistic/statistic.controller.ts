import {
  Controller,
  Get,
  Res,
  InternalServerErrorException,
} from "@nestjs/common";
import { Response } from "express";
import { ApiResponse } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { StatisticService } from "./statistic.service";
import { StatisticResponse } from "./dto/statistic.response";

@Controller("statistic")
export class StatisticController {
  constructor(private statisticService: StatisticService) {}

  @Get("")
  @ApiResponse({
    status: 200,
    type: StatisticResponse,
    description: "Successful",
  })
  async getStatistic(@Res() res: Response) {
    console.log(`[P]:::Get all statistics`);
    try {
      const statistic = await this.statisticService.getStatistic();
      let result = plainToInstance(StatisticResponse, statistic);
      return res.json(result);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException("Error when get all statistics");
    }
  }
}
