// INTAKE FORM
(function () {
  'use strict';

  const TOTAL_STEPS = 7;

  const welcomeScreen = document.getElementById('welcome-screen');
  const formScreen = document.getElementById('form-screen');
  const successScreen = document.getElementById('success-screen');
  const startBtn = document.getElementById('start-btn');
  const form = document.getElementById('intake-form');
  const nextBtn = document.getElementById('next-btn');
  const backBtn = document.getElementById('back-btn');
  const submitBtn = document.getElementById('submit-btn');
  const progressSteps = document.querySelectorAll('.progress-step');
  const formSteps = document.querySelectorAll('.form-step');
  const refNumberEl = document.getElementById('ref-number');

  if (!form) return;

  let currentStep = 1;

  /* ---------- Helpers ---------- */

  function hideElement(element) {
    if (!element) return;

    element.hidden = true;
    element.style.display = 'none';
  }

  function showElement(element) {
    if (!element) return;

    element.hidden = false;
    element.style.display = '';
  }

  function hideSiteHeader() {
    const placeholder = document.getElementById('header-placeholder');
    const header = document.getElementById('site-header');
    const rail = document.getElementById('chapter-rail');

    if (placeholder) {
      placeholder.hidden = true;
      placeholder.style.display = 'none';
    }

    if (header) {
      header.hidden = true;
      header.style.display = 'none';
    }

    if (rail) {
      rail.hidden = true;
      rail.style.display = 'none';
    }

    document.body.classList.add('intake-form-active');
  }

  function showScreen(screen) {
    [welcomeScreen, formScreen, successScreen].forEach(screenEl => {
      hideElement(screenEl);
    });

    showElement(screen);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function updateProgress() {
    progressSteps.forEach(step => {
      const num = Number(step.dataset.step);

      step.classList.remove(
        'is-active',
        'is-complete'
      );

      if (num === currentStep) {
        step.classList.add('is-active');
      } else if (num < currentStep) {
        step.classList.add('is-complete');
      }
    });
  }

  function showStep(step) {
    formSteps.forEach(stepEl => {
      const num = Number(stepEl.dataset.step);

      if (num === step) {
        showElement(stepEl);
        stepEl.classList.add('is-active');
      } else {
        hideElement(stepEl);
        stepEl.classList.remove('is-active');
      }
    });

    if (backBtn) {
      backBtn.hidden = step === 1;
    }

    if (nextBtn) {
      nextBtn.hidden = step === TOTAL_STEPS;
    }

    if (submitBtn) {
      const isLastStep = step === TOTAL_STEPS;

      submitBtn.hidden = !isLastStep;
      submitBtn.style.display = isLastStep ? '' : 'none';
    }

    currentStep = step;

    if (step === 7) {
      renderReview();
    }

    updateProgress();

    const activeStep = document.querySelector(
      `.form-step[data-step="${step}"]`
    );

    if (activeStep) {
      const first = activeStep.querySelector(
        'input, select, textarea, button'
      );

      if (first) {
        setTimeout(() => {
          first.focus({
            preventScroll: true
          });
        }, 80);
      }
    }
  }

  function clearErrors(stepEl) {
    if (!stepEl) return;

    stepEl.querySelectorAll('.field-error').forEach(el => {
      el.textContent = '';
    });

    stepEl.querySelectorAll('.is-invalid').forEach(el => {
      el.classList.remove('is-invalid');
    });

    stepEl.querySelectorAll('.is-invalid-group').forEach(el => {
      el.classList.remove('is-invalid-group');
    });
  }

  function setError(name, message) {
    const errorEl = document.querySelector(
      `[data-error-for="${name}"]`
    );

    if (errorEl) {
      errorEl.textContent = message;
    }

    const inputs = form.querySelectorAll(
      `[name="${name}"], [name="${name}[]"]`
    );

    inputs.forEach(input => {
      if (
        input.type === 'radio' ||
        input.type === 'checkbox'
      ) {
        const group = input.closest(
          '.radio-cards, .radio-row, .checkbox-list, .field-group'
        );

        if (group) {
          group.classList.add('is-invalid-group');
        }
      } else {
        input.classList.add('is-invalid');
      }
    });
  }

  function validateStep(step) {
    const stepEl = document.querySelector(
      `.form-step[data-step="${step}"]`
    );

    if (!stepEl) return true;

    clearErrors(stepEl);

    let valid = true;

    /* ---------- Step 1 ---------- */

    if (step === 1) {
      const seeking = form.querySelector(
        'input[name="seeking_services_for"]:checked'
      );

      if (!seeking) {
        setError(
          'seeking_services_for',
          'Please select who this intake is for.'
        );

        valid = false;
      }

      const relationshipGroup =
        document.getElementById('relationship-group');

      if (
        relationshipGroup &&
        !relationshipGroup.hidden
      ) {
        const rel =
          form.relationship_to_client.value;

        if (!rel) {
          setError(
            'relationship_to_client',
            'Please select your relationship to the client.'
          );

          valid = false;
        }
      }

      const first =
        form.first_name.value.trim();

      if (!first) {
        setError(
          'first_name',
          'First name is required.'
        );

        valid = false;
      }

      const last =
        form.last_name.value.trim();

      if (!last) {
        setError(
          'last_name',
          'Last name is required.'
        );

        valid = false;
      }

      const email =
        form.email.value.trim();

      if (
        email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ) {
        setError(
          'email',
          'Please enter a valid email address.'
        );

        valid = false;
      }
    }

    /* ---------- Step 2 ---------- */

    if (step === 2) {
      const services = form.querySelectorAll(
        'input[name="services_requested[]"]:checked'
      );

      if (services.length === 0) {
        setError(
          'services_requested',
          'Please select at least one service option.'
        );

        valid = false;
      }
    }

    /* ---------- Step 7 ---------- */

    if (step === 7) {
      if (!form.privacy_acknowledged.checked) {
        setError(
          'privacy_acknowledged',
          'Please acknowledge the privacy statement.'
        );

        valid = false;
      }

      if (!form.information_accuracy_confirmed.checked) {
        setError(
          'information_accuracy_confirmed',
          'Please confirm the accuracy of the information.'
        );

        valid = false;
      }
    }

    return valid;
  }


  function getRadioValue(name) {
  const el = form.querySelector(`input[name="${name}"]:checked`);
  return el ? el.value : '';
  }

  function getCheckboxValues(name) {
    return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
      .map(el => el.value);
  }

  function getSelectLabel(selectEl) {
    if (!selectEl || !selectEl.value) return '';
    const opt = selectEl.options[selectEl.selectedIndex];
    return opt ? opt.text.trim() : selectEl.value;
  }

  function displayValue(value) {
    if (Array.isArray(value)) {
      return value.length ? value.join(', ') : '';
    }
    return (value || '').toString().trim();
  }

  function formatLabelMap(value, map) {
    if (!value) return '';
    return map[value] || value;
  }

  function buildReviewRow(label, value) {
    const text = displayValue(value);
    const empty = !text;
    return `
      <div class="review-row">
        <span class="review-label">${label}</span>
        <span class="review-value${empty ? ' is-empty' : ''}">${empty ? 'Not provided' : text}</span>
      </div>
    `;
  }

  function buildReviewCard(step, title, rowsHtml) {
    return `
      <article class="review-card">
        <div class="review-card-header">
          <h3 class="review-card-title">${title}</h3>
          <button type="button" class="review-edit-btn" data-edit-step="${step}">
            <i class="fa-solid fa-pen" aria-hidden="true"></i>
            <span>Edit</span>
          </button>
        </div>
        <div class="review-list">${rowsHtml}</div>
      </article>
    `;
  }

  function renderReview() {
    const reviewEl = document.getElementById('intake-review');
    if (!reviewEl) return;

    const seekingMap = {
      myself: 'Myself',
      my_child: 'My child',
      another_person: 'Another person'
    };

    const relationshipMap = {
      parent: 'Parent',
      legal_guardian: 'Legal guardian',
      other: 'Other'
    };

    const yesNoMap = {
      yes: 'Yes',
      no: 'No',
      not_sure: 'Not sure',
      prefer_not_to_say: 'Prefer not to say'
    };

    const durationMap = {
      less_than_1_month: 'Less than 1 month',
      '1_to_3_months': '1–3 months',
      '3_to_6_months': '3–6 months',
      more_than_6_months: 'More than 6 months',
      not_sure: 'Not sure'
    };

    const contactMap = {
      text: 'Text',
      call: 'Call',
      email: 'Email',
      phone: 'Phone',
      either: 'Either is fine'
    };

    const seeking = getRadioValue('seeking_services_for');
    const relationship = form.relationship_to_client?.value || '';
    const services = getCheckboxValues('services_requested[]');
    const prpAreas = getCheckboxValues('prp_support_areas[]');
    const areas = getCheckboxValues('areas_needing_support[]');
    const days = getCheckboxValues('convenient_days[]');
    const times = getCheckboxValues('convenient_time_of_day[]');
    const dobDisplay = document.getElementById('date_of_birth')?.value || '';

    const aboutRows = [
      buildReviewRow('Seeking for', formatLabelMap(seeking, seekingMap)),
      seeking !== 'myself' ? buildReviewRow('Relationship', formatLabelMap(relationship, relationshipMap)) : '',
      buildReviewRow('First name', form.first_name.value),
      buildReviewRow('Last name', form.last_name.value),
      buildReviewRow('Preferred name', form.preferred_name.value),
      buildReviewRow('Date of birth', dobDisplay),
      buildReviewRow('Phone', form.phone.value),
      buildReviewRow('Email', form.email.value),
      buildReviewRow('Preferred contact', formatLabelMap(form.preferred_contact_method.value, contactMap))
    ].join('');

    const servicesRows = [
      buildReviewRow('Services', services),
      services.includes('PRP') ? buildReviewRow('PRP areas', prpAreas) : ''
    ].join('');

    const concernsRows = [
      buildReviewRow('Main reason', form.reason_for_seeking_services.value),
      buildReviewRow('Duration', formatLabelMap(form.concern_duration.value, durationMap)),
      buildReviewRow('Support areas', areas),
      buildReviewRow('Hoped outcomes', form.hoped_outcomes.value)
    ].join('');

    const historyRows = [
      buildReviewRow('Previous services', formatLabelMap(getRadioValue('previously_received_services'), yesNoMap)),
      buildReviewRow('Currently elsewhere', formatLabelMap(getRadioValue('currently_receiving_services'), yesNoMap)),
      buildReviewRow('Previous medication', formatLabelMap(getRadioValue('previously_taken_mental_health_medication'), yesNoMap)),
      buildReviewRow('Current medication', formatLabelMap(getRadioValue('currently_taking_mental_health_medication'), yesNoMap)),
      getRadioValue('currently_taking_mental_health_medication') === 'yes'
        ? buildReviewRow('Medication names', form.medication_names.value)
        : ''
    ].join('');

    const healthRows = [
      buildReviewRow('Primary care provider', formatLabelMap(getRadioValue('has_primary_care_provider'), yesNoMap)),
      buildReviewRow('Health concerns', form.medical_conditions_or_health_concerns.value),
      buildReviewRow('Has insurance', formatLabelMap(getRadioValue('has_health_insurance'), yesNoMap)),
      getRadioValue('has_health_insurance') === 'yes'
        ? buildReviewRow('Insurance provider', form.insurance_provider.value)
        : '',
      getRadioValue('has_health_insurance') === 'yes'
        ? buildReviewRow('Member / Policy ID', form.insurance_member_policy_id.value)
        : ''
    ].join('');

    const prefsRows = [
      buildReviewRow('Support contact', form.support_contact_name.value),
      buildReviewRow('Relationship', form.support_contact_relationship.value),
      buildReviewRow('Support phone', form.support_contact_phone.value),
      buildReviewRow('Follow-up method', formatLabelMap(form.follow_up_contact_method.value, contactMap)),
      buildReviewRow('Convenient days', days),
      buildReviewRow('Time of day', times)
    ].join('');

    reviewEl.innerHTML = [
      buildReviewCard(1, 'About You', aboutRows),
      buildReviewCard(2, 'Services', servicesRows),
      buildReviewCard(3, 'Concerns', concernsRows),
      buildReviewCard(4, 'History', historyRows),
      buildReviewCard(5, 'Health & Insurance', healthRows),
      buildReviewCard(6, 'Emergency Contact & Preferences', prefsRows)
    ].join('');

    reviewEl.querySelectorAll('.review-edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const step = Number(btn.dataset.editStep);
        if (step) showStep(step);
      });
    });
  }
  /* ---------- Conditional fields ---------- */

  function initConditionals() {

    /* Who is this for */

    const seekingRadios =
      form.querySelectorAll(
        'input[name="seeking_services_for"]'
      );

    const relationshipGroup =
      document.getElementById(
        'relationship-group'
      );

    seekingRadios.forEach(radio => {
      radio.addEventListener('change', () => {

        const value = radio.value;

        if (
          value === 'my_child' ||
          value === 'another_person'
        ) {
          showElement(relationshipGroup);

          form.relationship_to_client.required = true;

        } else {
          hideElement(relationshipGroup);

          form.relationship_to_client.required = false;
          form.relationship_to_client.value = '';
        }
      });
    });


    /* PRP support areas */

    const serviceCheckboxes =
      form.querySelectorAll(
        'input[name="services_requested[]"]'
      );

    const prpAreasGroup =
      document.getElementById(
        'prp-areas-group'
      );

    serviceCheckboxes.forEach(cb => {

      cb.addEventListener('change', () => {

        const prpChecked =
          form.querySelector(
            'input[name="services_requested[]"][value="PRP"]'
          )?.checked;

        if (prpAreasGroup) {

          if (prpChecked) {
            showElement(prpAreasGroup);
          } else {
            hideElement(prpAreasGroup);

            prpAreasGroup
              .querySelectorAll(
                'input[type="checkbox"]'
              )
              .forEach(c => {
                c.checked = false;
              });
          }
        }
      });
    });


    /* Medication */

    const medRadios =
      form.querySelectorAll(
        'input[name="currently_taking_mental_health_medication"]'
      );

    const medNamesGroup =
      document.getElementById(
        'medication-names-group'
      );

    medRadios.forEach(radio => {

      radio.addEventListener('change', () => {

        if (radio.value === 'yes') {
          showElement(medNamesGroup);
        } else {
          hideElement(medNamesGroup);

          form.medication_names.value = '';
        }
      });
    });


    /* Insurance */

    const insuranceRadios =
      form.querySelectorAll(
        'input[name="has_health_insurance"]'
      );

    const insuranceFields =
      document.getElementById(
        'insurance-fields'
      );

    insuranceRadios.forEach(radio => {

      radio.addEventListener('change', () => {

        if (radio.value === 'yes') {
          showElement(insuranceFields);
        } else {
          hideElement(insuranceFields);

          form.insurance_provider.value = '';
          form.insurance_member_policy_id.value = '';
        }
      });
    });
  }


  /* ---------- Start Intake ---------- */

  startBtn?.addEventListener('click', () => {
    hideSiteHeader();
    showScreen(formScreen);
    showStep(1);
  });


  /* ---------- Continue ---------- */

  nextBtn?.addEventListener('click', () => {

    if (!validateStep(currentStep)) {

      const firstError =
        document.querySelector(
          '.field-error:not(:empty)'
        );

      if (firstError) {
        firstError.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }

      return;
    }

    if (currentStep < TOTAL_STEPS) {
      showStep(currentStep + 1);
    }
  });


  /* ---------- Back ---------- */

  backBtn?.addEventListener('click', () => {

    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });


 /* ---------- Submit ---------- */

  form.addEventListener(
    'submit',
    async function (e) {

      e.preventDefault();

      if (!validateStep(TOTAL_STEPS)) {

        const firstError =
          document.querySelector(
            '.field-error:not(:empty)'
          );

        if (firstError) {
          firstError.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }

        return;
      }

      const originalText =
        submitBtn.textContent;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting…';

      try {

        const formData =
          new FormData(form);

        const response =
          await fetch(
            form.action,
            {
              method: 'POST',
              body: formData,
              headers: {
                'Accept': 'application/json'
              }
            }
          );

        const data =
          await response
            .json()
            .catch(() => null);

        if (
          response.ok &&
          data &&
          data.success === true
        ) {

          if (
            refNumberEl &&
            data.reference_number
          ) {
            refNumberEl.textContent =
              data.reference_number;
          } else if (refNumberEl) {
            refNumberEl.textContent =
              data.reference || '—';
          }

          /*
          * Give the submission/check animation
          * a moment before showing the success screen.
          */
          await new Promise(resolve =>
            setTimeout(resolve, 1800)
          );

          showScreen(successScreen);

        } else {

          const msg =
            data && data.message
              ? data.message
              : 'Something went wrong. Please try again or call us.';

          alert(msg);
        }

      } catch (err) {

        alert(
          'Unable to submit right now. Please check your connection or call us at 347-513-6514.'
        );

      } finally {

        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  );
  /* ---------- Initialize ---------- */

  initConditionals();

  hideElement(formScreen);
  hideElement(successScreen);

  showElement(welcomeScreen);

  if (submitBtn) {
    submitBtn.hidden = true;
    submitBtn.style.display = 'none';
  }

  showStep(1);

})();


// DOB
const dobText = document.getElementById('date_of_birth');
const dobPicker = document.getElementById('date_of_birth_picker');
const dobHidden = document.getElementById('date_of_birth_value');

function toISO(mmddyyyy) {
  const m = mmddyyyy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return '';
  return `${m[3]}-${m[1]}-${m[2]}`;
}

function toUS(iso) {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return '';
  return `${m[2]}/${m[3]}/${m[1]}`;
}

function syncHidden() {
  if (!dobHidden) return;
  dobHidden.value = toISO(dobText.value);
}

if (dobText) {
  dobText.addEventListener('input', (e) => {
    let d = e.target.value.replace(/\D/g, '').slice(0, 8);
    let f = d;
    if (d.length > 2) f = d.slice(0, 2) + '/' + d.slice(2);
    if (d.length > 4) f = d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4);
    e.target.value = f;
    syncHidden();
  });

  dobText.addEventListener('blur', syncHidden);
}

if (dobPicker && dobText) {
  dobPicker.addEventListener('change', () => {
    if (dobPicker.value) {
      dobText.value = toUS(dobPicker.value);
      syncHidden();
    }
  });
}

// Before submit, ensure hidden field is set
const intakeForm = document.getElementById('intake-form');
if (intakeForm) {
  intakeForm.addEventListener('submit', () => {
    syncHidden();
  });
}