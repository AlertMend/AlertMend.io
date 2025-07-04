import React from "react";
import { GradientContainer } from "../gradient-container";
import { Container } from "../container";
import { Heading } from "../heading";
import { Subheading } from "../subheading";
import { FeatureIconContainer } from "./feature-icon-container";
import { FaBolt, FaChartLine } from "react-icons/fa";
import {
  Card,
  CardDescription,
  CardSkeletonContainer,
  CardTitle,
} from "./card";
import { SkeletonOne } from "./skeletons/first";
import { SkeletonTwo } from "./skeletons/second";
import { SkeletonThree } from "./skeletons/third";
import { SkeletonFour } from "./skeletons/fourth";
import { SkeletonFive } from "./skeletons/fifth";

export const Features = () => {
  return (
    <GradientContainer className="md:my-20">
      <Container className="py-20 max-w-5xl mx-auto  relative z-40">
        <FeatureIconContainer className="flex justify-center items-center overflow-hidden">
          <FaBolt className="h-6 w-6 text-cyan-500" />
        </FeatureIconContainer>
        <Heading className="pt-4">Automate Your Kubernetes Ops</Heading>
        <Subheading>
          AlertMend comes with powerful workflows to automate alert response, remediation, and cost optimization, helping your team spend less time firefighting.
        </Subheading>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 py-10">
          <Card className="lg:col-span-2">
            <CardTitle>Integrations</CardTitle>
            <CardDescription>
            AlertMend seamlessly integrates with leading alerting and monitoring tools such as Alertmanager, Prometheus, and Grafana, allowing you to effortlessly trigger Remediation Flows (RFs) within your Kubernetes stack. In addition, it supports communication platforms like Slack and Microsoft Teams, along with incident management tools like PagerDuty and ServiceNow, enabling real-time notifications and streamlined incident response across your entire ecosystem
            </CardDescription>
            <CardSkeletonContainer>
              <SkeletonOne />
            </CardSkeletonContainer>
          </Card>
          {/*<Card>
            <CardSkeletonContainer className="max-w-[16rem] mx-auto">
              <SkeletonTwo />
            </CardSkeletonContainer>
            <CardTitle>Analytics for everything</CardTitle>
            <CardDescription>
              Check analytics, track your posts, and get insights into your
              audience.
            </CardDescription>
          </Card>*/}
          <Card>
            <CardSkeletonContainer>
              <SkeletonThree />
            </CardSkeletonContainer>
            <CardTitle>Integrated AI</CardTitle>
            <CardDescription>
              From intelligent alert handling to auto-remediation suggestions, AlertMend uses AI to make your infrastructure smarter.
            </CardDescription>
          </Card>
          {/*<Card>
            <CardSkeletonContainer
              showGradient={false}
              className="max-w-[16rem] mx-auto"
            >
              <SkeletonFour />
            </CardSkeletonContainer>
            <CardTitle>Easy Collaboration</CardTitle>
            <CardDescription>
              AlertMend can integrate with Zapier, Slack and every other popular
              integration tools.
            </CardDescription>
          </Card>*/}
          {/*<Card>
            <CardSkeletonContainer>
              <SkeletonFive />
            </CardSkeletonContainer>
            <CardTitle>Know your audience</CardTitle>
            <CardDescription>
              Based on your audience, create funnels and drive more traffic.
            </CardDescription>
          </Card>*/}
        </div>
      </Container>
    </GradientContainer>
  );
};
