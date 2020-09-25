import {
  Box,
  Button,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";
import { Field, Form, Formik, FormikConfig, FormikValues } from "formik";
import { CheckboxWithLabel, TextField } from "formik-material-ui";
import { object, mixed, number, string } from "yup";
import React, { useState } from "react";

const sleep = (time: number) => new Promise((acc) => setTimeout(acc,time))

function Home() {
  return (
    <Card>
      <CardContent>
        <FormikStepper
          initialValues={{
            firstName: "",
            lastName: "",
            millionaire: false,
            money: 0,
            description: "",
          }}
          onSubmit={async (values) => {
            await sleep(3000);
            alert(JSON.stringify(values));
          }}
        >
          <FormikStep label='Personal Data'
          validationSchema={object({
            firstName: string().required()
          })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="firstName"
                component={TextField}
                label="firstName"
              />
            </Box>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="lastName"
                component={TextField}
                label="lastName"
              />
            </Box>
            <Box>
              <Field
                name="millionaire"
                type="checkbox"
                component={CheckboxWithLabel}
                Label={{ label: "I am a Millionaire" }}
              />
            </Box>
          </FormikStep>
          <FormikStep
            label="Bank Account"
            validationSchema={object({
              money: mixed().when("millionaire", {
                is: true,
                then: number().required().min(1_000_000, "you poor"),
                otherwise: number().required(),
              }),
            })}
          >
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="money"
                type="number"
                component={TextField}
                label="All the money I have"
              />
            </Box>
          </FormikStep>
          <FormikStep label='More Info'>
            <Box paddingBottom={2}>
              <Field
                fullWidth
                name="description"
                component={TextField}
                label="Description"
              />
            </Box>
          </FormikStep>
        </FormikStepper>
      </CardContent>
    </Card>
  );
}

export default Home;

interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: String;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

export function FormikStepper({
  children,
  ...props
}: FormikConfig<FormikValues>) {
  const childrenArray = React.Children.toArray(children) as React.ReactElement<
    FormikStepProps
  >[];

  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];

  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
        } else {
          setStep((currentStep) => currentStep + 1);
        }
      }}
    >
      {({isSubmitting}) => (
        <Form autoComplete="off">
        <Stepper  alternativeLabel activeStep={step}>
          {childrenArray.map((child,i) => (
            <Step key={i}>
              <StepLabel>{child.props.label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {currentChild}
        <div style={{float: 'right'}}>
        {step > 0 ? (
          <Button disabled={isSubmitting}
          style={{marginRight: '10px'}}
            color="secondary"
            variant="contained"
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
        ) : null}
        <Button  disabled={isSubmitting} color="secondary" variant="contained" type="submit">
          {isSubmitting ? 'Submitting' : isLastStep() ? "Submit" : "Next"}
        </Button>
        </div>
      </Form>
      )}
      
    </Formik>
  );
}
