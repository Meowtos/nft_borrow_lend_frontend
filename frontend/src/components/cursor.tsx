'use client'
import { useEffect } from 'react';
const Cursor = () => {
    useEffect(() => {
        // cursor
        window.addEventListener('mousemove', (e) => {
          let xcord = e.clientX;
          let ycord = e.clientY;

          let dots = document.querySelectorAll('.dots');
          dots.forEach(dot => {
            const element = dot as HTMLElement; // Type cast each element to HTMLElement
            element.style.left = xcord + 'px';
            element.style.top = ycord + 'px';
          });
        });
        // cursor-end
      }, []);

    return (
        <>
            <section className="cursor-follow" id='cursor'>
                <span className="c1 dots"></span>
                <span className="c2 dots"></span>
                <span className="c3 dots"></span>
                <span className="c4 dots"></span>
                <span className="c5 dots"></span>
                <span className="c6 dots"></span>
                <span className="c7 dots"></span>
                <span className="c8 dots"></span>
                <span className="c9 dots"></span>
                <span className="c10 dots"></span>
                <span className="c11 dots"></span>
                <span className="c12 dots"></span>
                <span className="c13 dots"></span>
                <span className="c14 dots"></span>
                <span className="c15 dots"></span>
                <span className="c16 dots"></span>
                <span className="c17 dots"></span>
                <span className="c18 dots"></span>
                <span className="c19 dots"></span>
                <span className="c20 dots"></span>
            </section>
        </>
    )
}
export default Cursor;