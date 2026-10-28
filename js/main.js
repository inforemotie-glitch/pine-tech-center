/* ==========================================================
   Pine Tech Center
   Site interactions: navigation, filters, modal, accordion,
   counters, scroll reveal, copy buttons and contact form.
   ========================================================== */
(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  }

  /* Extra detail shown in the service quick-view modal */
  var SERVICES = {
    'managed-support': {
      tag: 'Support',
      intro: 'Your team gets one number to call and a technician who knows your setup. We handle the day to day issues and keep an eye on everything in the background.',
      points: [
        'Helpdesk support by phone, email and remote session',
        'Scheduled on-site visits plus urgent call-outs',
        'Patching and software updates done for you',
        'Device monitoring with alerts sent to our team',
        'Monthly reports written in plain English'
      ]
    },
    cybersecurity: {
      tag: 'Security',
      intro: 'Most attacks on small businesses start with one email or a weak password. We put sensible layers of protection in place and keep them up to date.',
      points: [
        'Managed antivirus and threat detection on every device',
        'Multi-factor authentication set up for your team',
        'Email filtering that stops scams and dodgy attachments',
        'Essential Eight security reviews',
        'Staff training with simulated phishing tests'
      ]
    },
    network: {
      tag: 'Infrastructure',
      intro: 'Slow Wi-Fi and dropouts waste hours every week. We design, install and manage networks that stay fast and secure as your business grows.',
      points: [
        'Site surveys and Wi-Fi coverage planning',
        'Structured cabling and tidy comms racks',
        'Firewall setup and ongoing management',
        'Secure remote access for staff working from home',
        'NBN and business fibre coordination'
      ]
    },
    cloud: {
      tag: 'Cloud',
      intro: 'Microsoft 365 can do a lot more than email. We set it up properly, move your files across safely and show your team how to get the most from it.',
      points: [
        'Email and file migration with no lost data',
        'Teams, SharePoint and OneDrive setup',
        'Security settings tuned for small business',
        'Licence reviews so you only pay for what you use',
        'Training sessions for your staff'
      ]
    },
    backup: {
      tag: 'Security',
      intro: 'A backup is only useful if you can restore from it. We automate your backups, store copies safely in Australia and test them regularly.',
      points: [
        'Automated daily backups of servers and PCs',
        'Microsoft 365 email and file backup',
        'Encrypted off-site copies stored in Australia',
        'Scheduled restore tests with written results',
        'A simple disaster recovery plan for your business'
      ]
    },
    voip: {
      tag: 'Phones',
      intro: 'Cloud phones give you a professional phone system without the old box in the cupboard. Calls follow your team wherever they work.',
      points: [
        'Keep your existing business numbers',
        'Desk phones, mobile apps and laptop softphones',
        'Call queues, menus and on-hold messages',
        'Voicemail sent straight to email',
        'Clear monthly pricing with local support'
      ]
    },
    hardware: {
      tag: 'Infrastructure',
      intro: 'We source business-grade gear at fair prices and set it up before it arrives, so your staff can log in and get to work on day one.',
      points: [
        'Laptops, desktops, monitors and docking stations',
        'Network gear, printers and meeting room tech',
        'Devices configured and tested before delivery',
        'Warranty and asset tracking',
        'Responsible recycling of old equipment'
      ]
    },
    consulting: {
      tag: 'Support',
      intro: 'Planning an office move, a software change or next year\'s IT budget? We give you honest recommendations based on what your business needs.',
      points: [
        'IT roadmaps and yearly budget planning',
        'Project management for upgrades and moves',
        'Software and vendor recommendations',
        'Security and compliance reviews',
        'Regular check-ins with a dedicated consultant'
      ]
    }
  };

  /* ---------- Footer year ---------- */
  function initYear() {
    $$('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ---------- Sticky header shadow ---------- */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var update = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------- Mobile navigation ---------- */
  function initMobileNav() {
    var toggle = $('.nav-toggle');
    var nav = $('#primary-nav');
    var header = $('.site-header');
    if (!toggle || !nav || !header) return;

    function setOpen(open) {
      if (open) {
        var top = Math.max(header.getBoundingClientRect().bottom, 0);
        document.documentElement.style.setProperty('--nav-top', top + 'px');
      }
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    var desktop = window.matchMedia('(min-width: 1081px)');
    var onChange = function (event) {
      if (event.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener('change', onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- Highlight the current section in the nav ---------- */
  function initActiveNav() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var sections = [];
    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (section) sections.push({ section: section, link: link });
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sections.forEach(function (item) {
          var active = item.section === entry.target;
          item.link.classList.toggle('is-active', active);
          if (active) item.link.setAttribute('aria-current', 'true');
          else item.link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (item) { observer.observe(item.section); });
  }

  /* ---------- Gentle fade-up on scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.remove('reveal'); });
      return;
    }

    // Stagger cards that sit side by side
    items.forEach(function (el) {
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.classList.contains('reveal');
      });
      if (siblings.length > 1) {
        el.style.setProperty('--delay', Math.min(siblings.indexOf(el), 5) * 80 + 'ms');
      }
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        obs.unobserve(el);
        el.classList.add('is-visible');

        // Hand control back to the element's own hover transitions
        var finished = false;
        var finish = function () {
          if (finished) return;
          finished = true;
          el.classList.remove('reveal', 'is-visible');
          el.style.removeProperty('--delay');
        };
        el.addEventListener('transitionend', function handler(ev) {
          if (ev.target === el && ev.propertyName === 'opacity') {
            el.removeEventListener('transitionend', handler);
            finish();
          }
        });
        setTimeout(finish, 1800);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    var counters = $$('[data-count]');
    if (!counters.length || reduceMotion || !('IntersectionObserver' in window)) return;

    function render(el, value) {
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var suffix = el.getAttribute('data-suffix') || '';
      el.textContent = value.toLocaleString('en-AU', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + suffix;
    }

    function animate(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var duration = 1600;
      var start = null;
      function tick(now) {
        if (start === null) start = now;
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        render(el, target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else render(el, target);
      }
      requestAnimationFrame(tick);
    }

    counters.forEach(function (el) { render(el, 0); });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        obs.unobserve(entry.target);
        animate(entry.target);
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Service category filter ---------- */
  function initServiceFilter() {
    var buttons = $$('.filter__btn');
    var cards = $$('.service-card');
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');

        buttons.forEach(function (b) {
          var active = b === button;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });

        cards.forEach(function (card) {
          var categories = (card.getAttribute('data-category') || '').split(' ');
          var show = filter === 'all' || categories.indexOf(filter) !== -1;
          card.hidden = !show;
          if (show && !reduceMotion) {
            card.classList.remove('is-filtered-in');
            void card.offsetWidth;
            card.classList.add('is-filtered-in');
          }
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initAccordions() {
    $$('[data-accordion]').forEach(function (accordion) {
      accordion.addEventListener('click', function (event) {
        var button = event.target.closest('.faq-q');
        if (!button || !accordion.contains(button)) return;

        var item = button.closest('.faq-item');
        var open = !item.classList.contains('is-open');

        $$('.faq-item.is-open', accordion).forEach(function (other) {
          if (other === item) return;
          other.classList.remove('is-open');
          $('.faq-q', other).setAttribute('aria-expanded', 'false');
        });

        item.classList.toggle('is-open', open);
        button.setAttribute('aria-expanded', String(open));
      });
    });
  }

  /* ---------- Toast notifications ---------- */
  var toastTimer = null;
  function showToast(message, isError) {
    var toast = $('#toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.toggle('is-error', Boolean(isError));
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2800);
  }

  /* ---------- Copy to clipboard ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () {
        return true;
      }, function () {
        return fallbackCopy(text);
      });
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    var area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (error) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  function initCopyButtons() {
    $$('[data-copy]').forEach(function (button) {
      var label = $('span', button);
      var original = label ? label.textContent : '';
      var resetTimer = null;

      button.addEventListener('click', function () {
        var name = button.getAttribute('data-copy-label') || 'Text';
        copyText(button.getAttribute('data-copy')).then(function (ok) {
          if (!ok) {
            showToast('Sorry, that did not copy. Please copy it manually.', true);
            return;
          }
          showToast(name + ' copied to clipboard');
          button.classList.add('is-copied');
          if (label) label.textContent = 'Copied';
          clearTimeout(resetTimer);
          resetTimer = setTimeout(function () {
            button.classList.remove('is-copied');
            if (label) label.textContent = original;
          }, 2000);
        });
      });
    });
  }

  /* ---------- Service quick-view modal ---------- */
  function initServiceModal() {
    var modal = $('#service-modal');
    if (!modal) return;

    var img = $('#modal-img', modal);
    var tag = $('#modal-tag', modal);
    var title = $('#modal-title', modal);
    var intro = $('#modal-intro', modal);
    var list = $('#modal-points', modal);
    var enquire = $('[data-modal-enquire]', modal);
    var lastFocus = null;
    var currentService = '';
    var supportsDialog = typeof modal.showModal === 'function';

    function open(card) {
      var data = SERVICES[card.getAttribute('data-service')] || {};
      var cardImg = $('img', card);
      var points = data.points || $$('.check-list li', card).map(function (li) { return li.textContent; });

      currentService = $('h3', card).textContent.trim();
      title.textContent = currentService;
      tag.textContent = data.tag || 'Service';
      intro.textContent = data.intro || $('p', card).textContent;
      img.src = cardImg.getAttribute('src').replace(/w=\d+/, 'w=1000').replace(/h=\d+/, 'h=900');
      img.alt = cardImg.alt;

      list.innerHTML = '';
      points.forEach(function (text) {
        var li = document.createElement('li');
        li.textContent = text;
        list.appendChild(li);
      });

      lastFocus = document.activeElement;
      document.body.classList.add('modal-open');
      if (supportsDialog) modal.showModal();
      else modal.setAttribute('open', '');
      $('.modal__close', modal).focus();
    }

    function afterClose() {
      document.body.classList.remove('modal-open');
      if (lastFocus && typeof lastFocus.focus === 'function') {
        lastFocus.focus({ preventScroll: true });
      }
      lastFocus = null;
    }

    function close() {
      if (supportsDialog) {
        if (modal.open) modal.close();
      } else {
        modal.removeAttribute('open');
        afterClose();
      }
    }

    modal.addEventListener('close', afterClose);

    $$('.service-card').forEach(function (card) {
      card.addEventListener('click', function (event) {
        if (event.target.closest('a')) return;
        open(card);
      });
    });

    modal.addEventListener('click', function (event) {
      if (event.target === modal || event.target.closest('[data-modal-close]')) close();
    });

    if (enquire) {
      enquire.addEventListener('click', function () {
        var select = $('#service');
        if (select) {
          Array.prototype.forEach.call(select.options, function (option) {
            if (option.text === currentService) select.value = option.value;
          });
        }
        lastFocus = null;
        close();
      });
    }
  }

  /* ---------- Contact form ---------- */
  function initContactForm() {
    var form = $('#contact-form');
    var success = $('#form-success');
    if (!form || !success) return;

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var phonePattern = /^[+()\d\s-]{8,20}$/;

    var rules = {
      name: function (value) {
        return value.trim().length >= 2 || 'Please enter your name.';
      },
      email: function (value) {
        return emailPattern.test(value.trim()) || 'Please enter a valid email address.';
      },
      phone: function (value) {
        return !value.trim() || phonePattern.test(value.trim()) || 'Please enter a valid phone number.';
      },
      message: function (value) {
        return value.trim().length >= 10 || 'Please add a few more details (at least 10 characters).';
      }
    };

    function field(name) {
      return form.elements.namedItem(name);
    }

    function validate(input) {
      var result = rules[input.name](input.value);
      var wrapper = input.closest('.field');
      var error = $('.field__error', wrapper);
      var valid = result === true;
      wrapper.classList.toggle('has-error', !valid);
      input.setAttribute('aria-invalid', String(!valid));
      if (error) error.textContent = valid ? '' : result;
      return valid;
    }

    Object.keys(rules).forEach(function (name) {
      var input = field(name);
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim()) validate(input);
      });
      input.addEventListener('input', function () {
        if (input.closest('.field').classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var invalid = Object.keys(rules)
        .map(field)
        .filter(function (input) { return input && !validate(input); });

      if (invalid.length) {
        invalid[0].focus();
        showToast('Please check the highlighted fields.', true);
        return;
      }

      var get = function (name) {
        var input = field(name);
        return input ? input.value.trim() : '';
      };

      var brand = form.getAttribute('data-company') || 'Pine Tech Center';
      var name = get('name');
      var company = get('company');
      var subject = brand + ': Website enquiry from ' + name + (company ? ' (' + company + ')' : '');
      var lines = ['Name: ' + name];
      if (company) lines.push('Business: ' + company);
      lines.push('Email: ' + get('email'));
      if (get('phone')) lines.push('Phone: ' + get('phone'));
      if (get('service')) lines.push('Service: ' + get('service'));
      lines.push('', get('message'), '', 'Sent from the ' + brand + ' website');

      var mailto = 'mailto:' + form.getAttribute('data-email') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      $('h3', success).textContent = 'Thanks, ' + name.split(/\s+/)[0] + '! Your message to ' + brand + ' is ready.';
      form.hidden = true;
      success.hidden = false;
      success.focus();

      showToast('Opening your email app to send this to ' + brand);
      window.location.href = mailto;
    });

    var reset = $('[data-form-reset]', success);
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        $$('.field', form).forEach(function (wrapper) { wrapper.classList.remove('has-error'); });
        $$('[aria-invalid]', form).forEach(function (input) { input.removeAttribute('aria-invalid'); });
        success.hidden = true;
        form.hidden = false;
        field('name').focus();
      });
    }
  }

  initYear();
  initHeader();
  initMobileNav();
  initActiveNav();
  initReveal();
  initCounters();
  initServiceFilter();
  initAccordions();
  initCopyButtons();
  initServiceModal();
  initContactForm();
})();
