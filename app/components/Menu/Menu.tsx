"use client";

import Link from "next/link";
import styles from "./Menu.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const Menu = () => {
  const [apiCallState, setApiCallState] = useState("no call");
  const router = useRouter();

  useEffect(() => {
    if (apiCallState === "done") {
      router.refresh();
    }
  }, [apiCallState]);

  const onClickFetchMore = () => {
    setApiCallState("start api call");
    fetch(`${appUrl}/api/mutations/add-podcasts`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApiCallState("done");
        }
      });
  };

  return apiCallState === "start api call" ? (
    <div className={styles.menuloading}>
      <LoadingSkeleton
        message="Fetching more shows (may have to wait for upto 5 mins)...."
        baseColor="#e3ccb0"
      />
    </div>
  ) : (
    <div className={styles.menu}>
      <div>
        <Link href="/profile">
          <h2 className={styles.clickhere}>My Profile</h2>
        </Link>
      </div>
      <div>
        <Link href="/shows-chart">
          <h2 className={styles.clickhere}>Show Content Analysis</h2>
        </Link>
      </div>
      <div>
        <h2 className={styles.clickhere} onClick={onClickFetchMore}>
          Get More Shows
        </h2>
      </div>
    </div>
  );
};

export default Menu;
