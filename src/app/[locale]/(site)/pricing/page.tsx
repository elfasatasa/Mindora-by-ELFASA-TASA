

import styles from "./Pricing.module.scss"

export default function Pricing() {
  

    return (
        <div>
            <div>
                <div className={styles.title}>Pricing of test</div>
                <br />
                <div className={styles.services}>
                    <span>Draft creation +</span>
                    <span className={styles.price}>1$</span>
                </div>
                  <div className={styles.services}>
                    <span>Status local +</span>
                    <span className={styles.price}>2$</span>
                </div>
                  <div className={styles.services}>
                    <span>Status public +</span>
                    <span className={styles.price}>4$</span>
                </div>
                 <div className={styles.services}>
                    <span>Status private +</span>
                    <span className={styles.price}>7$</span>
                </div>
                   <div className={styles.services}>
                    <span>Expire 7 day +</span>
                    <span className={styles.price}>1$</span>
                </div>
                <br />
                <br />
            </div>
           <div>
                <div className={styles.title}>Pricing of user</div>
                <br />
                <div className={styles.services}>
                    <span>Connection user +</span>
                    <span className={styles.price}>1$</span>
                </div>
                <br />
                <br />
            </div>
          <div>
                <div className={styles.title}>Service</div>
                <br />
                <div className={styles.services}>
                    <span>Create 100 questions</span>
                    <span className={styles.price}>1$</span>
                </div>
                <br />
                <br />
            </div>

<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />
<br />

         <div className={styles.getService}>Buy </div>

        </div>
    )
}