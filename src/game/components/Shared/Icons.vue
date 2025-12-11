<template>
  <div style="display: none">
    <svg
      id="menu"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
    >
      <!---->
      <path
        fill="currentColor"
        d="M19 4H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1m.15 6H4.85a.85.85 0 0 0-.85.85v2.3c0 .47.38.85.85.85h14.3c.47 0 .85-.38.85-.85v-2.3a.85.85 0 0 0-.85-.85M19 16H5a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
      ></path>
    </svg>
    <svg id="arrow" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        d="M17.293 8.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6-.068-.076A1 1 0 0 1 6.63 8.225l.076.068L12 13.586z"
      ></path>
    </svg>
    <svg id="close" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        d="M4.293 4.293a1 1 0 0 1 1.338-.069l.076.069L12 10.586l6.293-6.293.076-.069a1 1 0 0 1 1.407 1.407l-.069.076L13.414 12l6.293 6.293.069.076a1 1 0 0 1-1.407 1.406l-.076-.068L12 13.414l-6.293 6.293a1 1 0 0 1-1.414-1.414L10.586 12 4.293 5.707l-.068-.076a1 1 0 0 1 .068-1.338"
      ></path>
    </svg>
    <svg id="rotate" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        d="M19.539 9.345a1 1 0 0 1 1.338.068l2.83 2.83.069.076a1 1 0 0 1-1.407 1.406l-.076-.068-1.158-1.158a9 9 0 0 1-2.616 5.866l-.002.002c-3.4 3.4-8.86 3.507-12.389.32l-.335-.32-.069-.076a1 1 0 0 1 1.407-1.406l.076.068.261.248a7.004 7.004 0 0 0 9.635-.248 7 7 0 0 0 2.02-4.372l-1.076 1.076a1 1 0 1 1-1.414-1.414l2.83-2.83zm-13.62-3.91c3.415-3.086 8.638-3.086 12.053 0l.335.318.069.076a1 1 0 0 1-1.407 1.407l-.076-.07-.26-.247a7.004 7.004 0 0 0-9.635.248 7 7 0 0 0-2.022 4.372l1.077-1.076a1 1 0 0 1 1.414 1.414l-2.83 2.83a1 1 0 0 1-1.414 0l-2.83-2.83-.068-.075a1 1 0 0 1 1.406-1.408l.076.069 1.156 1.156a9 9 0 0 1 2.618-5.864l.001-.002z"
      ></path>
    </svg>
    <svg id="info" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M21 1H6c-1.05 0-1.9.81-1.98 1.83H4V19H1v2c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5h3V3c0-1.1-.9-2-2-2M3 22c-.55 0-1-.45-1-1v-1h10.92v1c0 .37.11.7.28 1zm9.58-6H8c-.55 0-1-.45-1-1s.45-1 1-1h4.58c.55 0 1 .45 1 1s-.45 1-1 1M17 12H7.83c-.55 0-1-.45-1-1s.45-1 1-1H17c.55 0 1 .45 1 1s-.45 1-1 1m0-4H7.83c-.55 0-1-.45-1-1s.45-1 1-1H17c.55 0 1 .45 1 1s-.45 1-1 1m5-4h-2V3c0-.55.45-1 1-1s1 .45 1 1z"
        clip-rule="evenodd"
      ></path>
    </svg>
    <svg id="history" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        d="M22 1h-7c0 1.66-1.34 3-3 3S9 2.66 9 1H2v22h7c0-1.66 1.34-3 3-3s3 1.34 3 3h7zm-3.54 7.91-7.22 5.78a1.436 1.436 0 0 1-1.92-.1L6.43 11.7c-.56-.56-.56-1.48 0-2.04s1.48-.56 2.04 0l1.97 1.97 6.21-4.97c.62-.5 1.53-.4 2.03.23.5.62.4 1.53-.23 2.03z"
      ></path>
    </svg>
    <svg id="graph" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        d="M14.395 3c-.55 0-1 .45-1 1s.45 1 1 1h3.19l-9.49 9.49a.996.996 0 0 0 .71 1.7c.26 0 .51-.1.71-.29l9.49-9.49V9.6c0 .55.45 1 1 1s1-.45 1-1V4c0-.55-.45-1-1-1z"
      ></path>
      <path
        fill="currentColor"
        d="M19.995 19h-15V4c0-.55-.45-1-1-1s-1 .45-1 1v16c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1"
      ></path>
    </svg>
    <svg id="graph-2" xmlns="http://www.w3.org/2000/svg" fill="none" class="inline-block shrink-0">
      <!---->
      <path
        fill="currentColor"
        d="M21 1H3c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2m-1 9c0 .55-.45 1-1 1s-1-.45-1-1V8.63l-6.21 7.99c-.22.28-.58.43-.93.38a1.01 1.01 0 0 1-.79-.62l-1.36-3.41-2.93 3.66c-.2.25-.49.38-.78.38-.22 0-.44-.07-.62-.22-.43-.35-.5-.97-.16-1.41l4-5a1 1 0 0 1 1.71.26l1.35 3.38 5.45-7.01H15c-.55 0-1-.45-1-1s.45-1 1-1h4c.55 0 1 .45 1 1v4z"
      ></path>
    </svg>

    <!-- Created with Inkscape (http://www.inkscape.org/) -->
    <svg id="plus" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M220,128a4.0002,4.0002,0,0,1-4,4H132v84a4,4,0,0,1-8,0V132H40a4,4,0,0,1,0-8h84V40a4,4,0,0,1,8,0v84h84A4.0002,4.0002,0,0,1,220,128Z"
      />
    </svg>

    <svg id="minus" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 12L18 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>
