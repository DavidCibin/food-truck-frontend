import React from "react";
import { Container, Row, Col, Card, CardGroup } from "react-bootstrap";
import { FoodTrucks } from "../schema/foodTruck";

/** ************************************************************** */
/* Types */
type FoodTruckListProps = {
  foodTrucks: FoodTrucks[];
};

type StatusColorMap = {
  APPROVED: string;
  DENIED: string;
  EXPIRED: string;
  SUSPEND: string;
  PENDING: string;
  ISSUED: string;
  REQUESTED: string;
};

const colorMap: StatusColorMap = {
  APPROVED: "green",
  DENIED: "red",
  EXPIRED: "red",
  SUSPEND: "red",
  PENDING: "blue",
  ISSUED: "blue",
  REQUESTED: "blue",
};

/** ************************************************************** */
/* FoodTruckList Component */
export default function FoodTruckList({
  foodTrucks,
}: FoodTruckListProps): JSX.Element {
  /** ************************************************************** */
  /* Functions */
  function getBgColor(status: keyof StatusColorMap | string): string {
    return String(colorMap[status as keyof StatusColorMap]) || "";
  }

  /** ************************************************************** */
  /* Render */
  return (
    <div
      className="m-8 bg-orange-50 p-4 rounded shadow"
      data-testid="food-truck-list"
    >
      {foodTrucks.length === 0 ? (
        <div>No food trucks found.</div>
      ) : (
        <Container>
          <Row sm={1} md={2} lg={3} xl={4} xxl={5} className="g-4">
            {foodTrucks.map((truck) => (
              <Col sm key={truck.objectid} className="h-[350px]">
                <CardGroup className="h-100">
                  <Card
                    className="d-flex flex-column h-100 p-3"
                    data-testid="food-truck-card"
                  >
                    <Card.Body className="d-flex flex-column overflow-hidden">
                      <Card.Title>
                        <span className="text-orange-400">
                          {truck.applicant}
                        </span>
                      </Card.Title>
                      <Card.Text className="flex items-center gap-1">
                        <span className="text-xs capitalize">
                          Status: {truck.status.toLowerCase()}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: getBgColor(truck.status),
                          }}
                        ></span>
                      </Card.Text>
                      <Card.Text className="overflow-auto mt-2">
                        {truck.fooditems}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer>
                      <small className="text-muted">{truck.address}</small>
                    </Card.Footer>
                  </Card>
                </CardGroup>
              </Col>
            ))}
          </Row>
        </Container>
      )}
    </div>
  );
}
