"use client";

import { Field, Form, Formik, FormikHelpers } from "formik";
import { IUserDetails } from "../types/user";
import Link from "next/link";
import styles from "./page.module.css";
import { useEffect, useState } from "react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const Profile = () => {
  const initialValues: IUserDetails = {
    emailAddress: "",
    firstName: "",
    lastName: "",
    country: "",
  };
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<IUserDetails>({
    ...initialValues,
  });

  useEffect(() => {
    setFirstName(localStorage.getItem("firstName") || null);
    setLastName(localStorage.getItem("lastName") || null);
  }, []);

  const onSubmitHandler = async (
    values: IUserDetails,
    actions: FormikHelpers<IUserDetails>
  ) => {
    localStorage.setItem("firstName", values.firstName);
    localStorage.setItem("lastName", values.lastName);
    actions.resetForm();
    actions.setSubmitting(false);
    setFirstName(values.firstName);
    setLastName(values.lastName);
    setUserDetails({ ...values });
    await fetch(`${appUrl}/api/mutations/add-user-details`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(values),
    });
  };

  const validateEmail = (value: string) => {
    let error;

    if (!value || value === "") {
      error = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }

    return error;
  };

  const validateOtherFields = (value: string) => {
    let error;

    if (!value || value === "") {
      error = "Required";
    }

    return error;
  };

  return (
    <div>
      <Link href="/">
        <div className={styles.clickhere}>
          <h3>Back to Podcasts</h3>
        </div>
      </Link>
      <div className={styles.title}>
        {firstName || lastName ? (
          <h2>{`Hello ${firstName} ${lastName}`}</h2>
        ) : (
          <h2>Profile</h2>
        )}
      </div>
      <h3>Please enter the following details</h3>
      <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
        {({ errors, touched }) => (
          <Form>
            <div className={styles.formfields}>
              <div>
                <label htmlFor="emailAddress">Email Address: </label>
                <Field
                  id="emailAddress"
                  name="emailAddress"
                  placeholder="jonh@company.com"
                  validate={validateEmail}
                />
                {errors.emailAddress && touched.emailAddress && (
                  <div>{errors.emailAddress}</div>
                )}
              </div>
              <div>
                <label htmlFor="firstName">First Name: </label>
                <Field
                  id="firstName"
                  name="firstName"
                  placeholder="First Name"
                  validate={validateOtherFields}
                />
                {errors.firstName && touched.firstName && (
                  <div>{errors.firstName}</div>
                )}
              </div>
              <div>
                <label htmlFor="lastName">Last Name: </label>
                <Field
                  id="lastName"
                  name="lastName"
                  placeholder="Last Name"
                  validate={validateOtherFields}
                />
                {errors.lastName && touched.lastName && (
                  <div>{errors.lastName}</div>
                )}
              </div>
              <div>
                <label htmlFor="country">Country: </label>
                <Field
                  id="country"
                  name="country"
                  placeholder="Country"
                  validate={validateOtherFields}
                />
                {errors.country && touched.country && (
                  <div>{errors.country}</div>
                )}
              </div>
            </div>
            <button type="submit">Submit</button>
          </Form>
        )}
      </Formik>
      {userDetails?.emailAddress !== "" ? (
        <div className={styles.userdetails}>
          <div>
            <h3>You entered the following</h3>
          </div>
          <div>
            <label htmlFor="emailAddress">
              Email Address: {userDetails.emailAddress}
            </label>
          </div>
          <div>
            <label htmlFor="firstName">
              First Name: {userDetails.firstName}
            </label>
          </div>
          <div>
            <label htmlFor="lastName">Last Name: {userDetails.lastName}</label>
          </div>
          <div>
            <label htmlFor="country">Country: {userDetails.country}</label>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Profile;
