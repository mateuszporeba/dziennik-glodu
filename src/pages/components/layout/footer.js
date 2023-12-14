import React from 'react'
import styles from './footer.module.css'
import Link from 'next/link';

export default function footer() {
  return (
    <div className={styles.footer}>
      <p>Znajdz meeting</p>
      <dl>
        <dt>Spis Mityngów AA</dt>
        <dd><Link href="https://spis.aa.org.pl/index.php/meetings/?tsml-day=any&tsml-mode=me" target='blank'>Znajdz Mityng AA</Link></dd>
        <dt>Spis Mityngów NA</dt>
        <dd><Link href="https://anonimowinarkomani.org/mitingi_new/" target='blank'>Znajdź Mityngi NA</Link></dd>
      </dl>
    </div>
  )
}
