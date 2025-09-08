import { InfoCardProps } from "@/types/props/cards/InfoCardProps";
import {Card, CardHeader, CardBody} from "@heroui/card";

const InfoCard = (props: InfoCardProps) => {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <h4 className="font-bold text-large">{props.title}</h4>
        <small>{props.description}</small>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        {props.children}
      </CardBody>
    </Card>
  );
}
export default InfoCard;
