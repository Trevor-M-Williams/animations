import gsap from 'gsap';

export default function handleTextAnimation(element: HTMLElement) {
  const delay = parseFloat(element.getAttribute('data-ld-delay') || '0');
  const delayInSeconds = delay * 0.001;
  let stagger = parseFloat(element.getAttribute('data-ld-stagger') || '0');

  const lines = element.innerHTML.replace(/<br\s*\/?>/gi, '\n').split('\n');

  element.innerHTML = lines
    .map((line) => {
      const htmlString = decodeHtml(line).replace(
        /(<span[^>]*>[\s\S]*?<\/span>)|([\w'’]+|&lt;|&gt;|[^\w\s<]+)/g,
        (match, p1, p2) => {
          if (p1) {
            // Existing span handling
            return p1.replace(/class="/, 'class="word ');
          } else if (p2) {
            // Wrap match in a span, handling < and > specially
            const content = p2 === '&lt;' ? '<' : p2 === '&gt;' ? '>' : p2;
            return `<span class="word">${content}</span>`;
          }
          return match;
        }
      );

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlString, 'text/html');

      const words = doc.querySelectorAll('.word');
      words.forEach((word) => {
        const wordText = word.textContent || '';
        const letters = [...wordText]; // Using spread operator to correctly handle characters
        word.innerHTML = letters.map((letter) => `<span class="letter">${letter}</span>`).join('');
      });

      return doc.body.innerHTML;
    })
    .join('<br>');

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        const letters = element.querySelectorAll('.letter');
        if (stagger === 0) {
          const staggerMax = 0.05;
          const staggerMin = 0.005;
          stagger = Math.min(staggerMax, Math.max(staggerMin, 1 / letters.length));
        }

        const yOffset = '30%';
        const duration = 0.2;

        if (entry.isIntersecting) {
          gsap.fromTo(
            letters,
            { y: yOffset, opacity: 0 },
            {
              y: '0',
              opacity: 1,
              duration,
              stagger,
              ease: 'power3.out',
              delay: delayInSeconds,
            }
          );
        } else {
          gsap.killTweensOf(letters);
          gsap.set(letters, { y: yOffset, opacity: 0 });
        }
      });
    },
    { threshold: [0.1] }
  );

  observer.observe(element);
}

function decodeHtml(html: string) {
  const htmlEntities = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&ldquo;': '“',
    '&rdquo;': '”',
    '&lsquo;': '‘',
    '&rsquo;': '’',
    '&mdash;': '—',
    '&ndash;': '–',
    '&hellip;': '…',
    '&trade;': '™',
    '&copy;': '©',
    '&reg;': '®',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&times;': '×',
    '&divide;': '÷',
    '&plusmn;': '±',
    '&minus;': '−',
  };

  return html.replace(
    /&nbsp;|&amp;|&lt;|&gt;|&quot;|&#39;|&ldquo;|&rdquo;|&lsquo;|&rsquo;|&mdash;|&ndash;|&hellip;|&trade;|&copy;|&reg;|&euro;|&pound;|&yen;|&cent;|&times;|&divide;|&plusmn;|&minus;|/g,
    function (match) {
      return htmlEntities[match as keyof typeof htmlEntities] || match;
    }
  );
}
