<template>
  <!--Footer-->
  <footer id="footer">
    <div class="newsletter-section style">
      <p class="text-white">@2022 Escalabs - Todos los derechos reservados</p>

      <div class="footer-social">
        <ul class="list--inline site-footer__social-icons social-icons">
          <li>
            <a href="https://www.facebook.com/Escalabs/" target="__blank"
              ><i class="fa-brands fa-facebook"></i
            ></a>
          </li>
          <li>
            <a href="https://www.instagram.com/escalabs_/" target="__blank"
              ><i class="fa-brands fa-square-instagram"></i
            ></a>
          </li>
          <li>
            <a
              href="https://api.whatsapp.com/send?phone=51phone=51960945908&text=👋¡Hola Escalabs!"
              ><i class="fa-brands fa-square-whatsapp"></i
            ></a>
          </li>
        </ul>
      </div>
    </div>
  </footer>
  <!--End Footer-->
</template>

<script setup></script>

<style scoped>
.style {
  background: var(--green-primary-color);
  border: 0;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#footer {
  margin: 0;
  font-family: "Breuer";
  font-weight: 400 !important;
}

.style p {
  font-size: 8px;
  margin: 0;
}

@media screen and (min-width: 768px) {
  .style p {
    font-size: 13px;
  }
}
.social-icons li a i {
  color: #fff !important;
  font-size: 20px !important;
}

@media screen and (min-width: 768px) {
  .social-icons li a i {
    font-size: 30px !important;
  }
}

@media screen and (max-width: 600px) {
  .footer-social {
    margin: 0;
  }

  .social-icons li {
    padding: 0 5px;
  }

  .social-icons li a i {
    font-size: 25px !important;
  }
}

/* .eti-footer {
  color: #fff !important;
} */

/* Medium devices (tablets, 768px and up) */
@media (min-width: 375px) {
  .eti-footer {
    color: #fff !important;
    font-size: 12px;
  }
}

@media (min-width: 768px) {
  .eti-footer {
    color: #fff !important;
    font-size: 12px;
  }
}
</style>
