// Var global
let translations = {};
let currentLang = localStorage.getItem('language') || 'es';


function stickyNav() {
  let headerHeight = document.querySelector('header').offsetHeight / 2
  let navBar = document.querySelector('.header');
  let scrollValue = window.scrollY;

  if (scrollValue > headerHeight) {
    navBar.classList.add('header-sticky')
  } else {
    navBar.classList.remove('header-sticky')
  }
}
window.addEventListener('scroll', stickyNav)
window.addEventListener('scroll', () => {
  let section = document.querySelector('#sobre-mi');
  if(!section) return

  const rect = section.getBoundingClientRect()
  if (rect.top <= 1000) {
        console.log("Passed the target element!");
        
  }
})

window.addEventListener('scroll', function() {
  console.log(window.pageYOffset + 'px');
});

function changeColor() {
    if(section){
      console.log('sobre mi');
      
    }
}


// obtener valor del objeto
function getNestedValue(obj, path) {
  return path.split('.').reduce((curr, key) => {
    if (!isNaN(key) && Array.isArray(curr)) {
      return curr[parseInt(key)];
    }
    return curr?.[key];
  }, obj);
}

// cargar archivos JSON
async function loadTranslations() {
  try {
    const [esResponse, enResponse] = await Promise.all([
      fetch('./languages/es.json'),
      fetch('./languages/en.json')
    ]);
    
    const esData = await esResponse.json();
    const enData = await enResponse.json();
    
    translations = {
      es: esData.es,
      en: enData.en
    };
    
    return true;
  } catch (error) {
    console.error('Error cargando traducciones:', error);
    return false;
  }
}

// cambiar el idioma
function changeLanguage(lang) {
  if (!translations[lang]) {
    console.error(`Idioma ${lang} no encontrado`);
    return;
  }
  
  currentLang = lang;
  localStorage.setItem('language', lang);
  
  document.documentElement.lang = lang;

  const currentTranslations = translations[lang];
  document.title = currentTranslations.meta.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.content = currentTranslations.meta.description;
  }
  
  
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getNestedValue(currentTranslations, key);
    
    if (translation !== undefined && translation !== null) {
      if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
        element.placeholder = translation;
      } else {
        element.textContent = translation;
      }
    }
  });
  
  // Actualizar botone
  document.querySelectorAll('.lang__btn').forEach(btn => {
    const btnLang = btn.getAttribute('data-lang');
    
    if (btnLang === lang) {
      btn.classList.add('is-active');
      btn.setAttribute('aria-pressed', 'true');
    } else {
      btn.classList.remove('is-active');
      btn.setAttribute('aria-pressed', 'false');
    }
  });
}

// Iniciar cuando cargue
document.addEventListener('DOMContentLoaded', async () => {
  // Cargar las traducciones
  const loaded = await loadTranslations();
  
  if (loaded) {
    changeLanguage(currentLang);
    
    document.querySelectorAll('.lang__btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        changeLanguage(lang);
      });
    });
  } else {
    console.error('No se pudieron cargar las traducciones');
  }
});