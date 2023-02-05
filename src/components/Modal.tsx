import * as React from "react";

import styles from "./Modal.module.scss";

type ModalProps = {
  className?: string;
  header: string;
  children: React.ReactNode;
};

export function Modal(props: ModalProps) {
  return (
    <div className={styles.overlayWrapper}>
      <div className={styles.animatedContainer}>
        <div className={styles.childrenWrapper}>
          <h3 className={styles.modalHeader}>{props.header}</h3>
          <div className={styles.mainContentWrapper}>{props.children}</div>
        </div>
      </div>
    </div>
  );
}
