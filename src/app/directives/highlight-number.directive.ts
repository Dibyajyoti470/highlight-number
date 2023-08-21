import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[highlightNumber]',
})
export class HighlightNumberDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // split the host element text content into words
    const words = this.el.nativeElement.textContent.split(' ');

    // clear the text content
    this.renderer.setProperty(this.el.nativeElement, 'textContent', '');

    // initialized unhighlighted string
    let unhighlighted: string = '';

    words.forEach((word: any) => {
      if (!isNaN(word) && word !== '') {
        // if the word is a number, then create a span
        // including the unhighlighted string created till now and append it to the host element.
        // also, create a span including only the highlighted word and append it to the host element.
        // reset the unhighlighted string to -> ''

        // for example,
        // text: I am 25 years old
        // current word: 30 (number)
        // unhighlighted string created before: I am

        // result: <host-element>
        //            <span>I am</span>
        //            <span style="color: red;"> 25 </span>
        //         </host-element>

        this.appendToRef(unhighlighted, false);
        this.appendToRef(` ${word} `, true);
        unhighlighted = '';
      } else {
        // if the word is not a number, then append the word to unhighlighted string.
        unhighlighted = `${unhighlighted}${unhighlighted && ' '}${word}`;
      }
    });

    if (unhighlighted !== '') {
      // if the loop completes and the unhightlighted string is not empty,
      // then create a span of it and append it to the host element.

      // for example,
      // text: I am 25 years old
      // unhighlighted string: years old

      // result: <host-element>
      //            <span>I am </span>
      //            <span style="color: red;">25 </span>
      //            <span>years old</span> <- appended here
      //         </host-element>

      this.appendToRef(unhighlighted.trim(), false);
    }
  }

  appendToRef(content: string, highlight: boolean) {
    const span = this.renderer.createElement('span');
    if (highlight) {
      this.renderer.setStyle(span, 'color', 'red');
    }
    this.renderer.appendChild(span, this.renderer.createText(content));
    this.renderer.appendChild(this.el.nativeElement, span);
  }
}
