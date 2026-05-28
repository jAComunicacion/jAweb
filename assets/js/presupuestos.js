/**
 * Calculadora de Honorarios jArismendi® — Lógica de Negocio y UI
 * Desarrollado para jA Comunicación (jArismendi / Antigravity)
 */

document.addEventListener('DOMContentLoaded', () => {

    // Constantes del algoritmo
    const VALOR_HORA_BASE = 35; // USD
    const DIFERENCIAL_JA = 1.25; // +25%
    const VALOR_HORA_AJUSTADO = VALOR_HORA_BASE * DIFERENCIAL_JA; // 43.75 USD
    const COSTO_KM_USD = 0.15; // USD por km

    // Credenciales hardcodeadas (uso interno temporal)
    const AUTH_USER = "julio";
    const AUTH_PASS = "antigravity";

    // Variables de Estado
    let tcMep = 0; // Tipo de cambio MEP
    let calculationDebounceTimeout;

    // --- ELEMENTOS DEL DOM ---
    // Contenedores de vistas
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.getElementById('app-container');
    const btnLogout = document.getElementById('btn-logout');

    // Formulario de Login
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    // Formulario de la App - Datos de entrada
    const pricingForm = document.getElementById('pricing-form');
    const clientNameInput = document.getElementById('client-name');
    const companyMomentSelect = document.getElementById('company-moment');
    const hoursInsituInput = document.getElementById('hours-insitu');
    const hoursRemoteInput = document.getElementById('hours-remote');
    const hoursPlanningInput = document.getElementById('hours-planning');
    const kmWeekInput = document.getElementById('km-week');

    // Hints de cálculo de horas/km
    const hintInsitu = document.getElementById('hint-insitu');
    const hintRemote = document.getElementById('hint-remote');
    const hintPlanning = document.getElementById('hint-planning');
    const hintKm = document.getElementById('hint-km');
    const totalHoursMonthBadge = document.getElementById('total-hours-month');

    // Constantes de estructura
    const AREAS  = ['dcv', 'me', 'growth'];
    const STAGES = ['idear', 'disenar', 'desarrollar', 'mantener'];

    // Checkboxes de Área (nivel 1)
    const areaCheckboxes = {
        dcv:    document.getElementById('area-dcv'),
        me:     document.getElementById('area-me'),
        growth: document.getElementById('area-growth')
    };

    // Contenedores de etapas del área (desplegables, nivel 1)
    const areaContainers = {
        dcv:    document.getElementById('stages-dcv'),
        me:     document.getElementById('stages-me'),
        growth: document.getElementById('stages-growth')
    };

    // Cajas de área (para clase .active)
    const areaBoxes = {
        dcv:    document.getElementById('area-box-dcv'),
        me:     document.getElementById('area-box-me'),
        growth: document.getElementById('area-box-growth')
    };

    // Checkboxes de etapa por área (nivel 2)
    const stageCheckboxes = {
        dcv:    { idear: document.getElementById('stage-dcv-idear'),    disenar: document.getElementById('stage-dcv-disenar'),    desarrollar: document.getElementById('stage-dcv-desarrollar'),    mantener: document.getElementById('stage-dcv-mantener')    },
        me:     { idear: document.getElementById('stage-me-idear'),     disenar: document.getElementById('stage-me-disenar'),     desarrollar: document.getElementById('stage-me-desarrollar'),     mantener: document.getElementById('stage-me-mantener')     },
        growth: { idear: document.getElementById('stage-growth-idear'), disenar: document.getElementById('stage-growth-disenar'), desarrollar: document.getElementById('stage-growth-desarrollar'), mantener: document.getElementById('stage-growth-mantener') }
    };

    // Contenedores de servicios por área/etapa (desplegables, nivel 2)
    const stageContainers = {
        dcv:    { idear: document.getElementById('services-dcv-idear'),    disenar: document.getElementById('services-dcv-disenar'),    desarrollar: document.getElementById('services-dcv-desarrollar'),    mantener: document.getElementById('services-dcv-mantener')    },
        me:     { idear: document.getElementById('services-me-idear'),     disenar: document.getElementById('services-me-disenar'),     desarrollar: document.getElementById('services-me-desarrollar'),     mantener: document.getElementById('services-me-mantener')     },
        growth: { idear: document.getElementById('services-growth-idear'), disenar: document.getElementById('services-growth-disenar'), desarrollar: document.getElementById('services-growth-desarrollar'), mantener: document.getElementById('services-growth-mantener') }
    };

    // Cajas de etapa por área/etapa (para clase .active)
    const stageBoxes = {
        dcv:    { idear: document.getElementById('stage-box-dcv-idear'),    disenar: document.getElementById('stage-box-dcv-disenar'),    desarrollar: document.getElementById('stage-box-dcv-desarrollar'),    mantener: document.getElementById('stage-box-dcv-mantener')    },
        me:     { idear: document.getElementById('stage-box-me-idear'),     disenar: document.getElementById('stage-box-me-disenar'),     desarrollar: document.getElementById('stage-box-me-desarrollar'),     mantener: document.getElementById('stage-box-me-mantener')     },
        growth: { idear: document.getElementById('stage-box-growth-idear'), disenar: document.getElementById('stage-box-growth-disenar'), desarrollar: document.getElementById('stage-box-growth-desarrollar'), mantener: document.getElementById('stage-box-growth-mantener') }
    };

    // Elementos de Anclaje
    const anchorOptionRadios = document.getElementsByName('anchor-option');
    const anchorFieldBlocks = {
        'option-a': document.getElementById('fields-option-a'),
        'option-b': document.getElementById('fields-option-b'),
        'option-c': document.getElementById('fields-option-c')
    };
    
    // Inputs específicos de Anclaje
    const productPriceInput = document.getElementById('product-price');
    const interventionMonthsInput = document.getElementById('intervention-months');
    const calcResultA = document.getElementById('calc-result-a');

    const clientHourlyRateInput = document.getElementById('client-hourly-rate');
    const competitorHourlyRateInput = document.getElementById('competitor-hourly-rate');
    const calcResultB = document.getElementById('calc-result-b');

    const salaryReferenceInput = document.getElementById('salary-reference');
    const calcResultC = document.getElementById('calc-result-c');

    const crisisAlert = document.getElementById('crisis-alert');

    // Elementos de Resultados en UI
    const resTotalHours = document.getElementById('res-total-hours');
    const resHourlyValue = document.getElementById('res-hourly-value');
    const resSubtotalOp = document.getElementById('res-subtotal-op');
    const resAnchorVal = document.getElementById('res-anchor-val');
    const resContextAdj = document.getElementById('res-context-adj');
    const resPriceUsd = document.getElementById('res-price-usd');
    
    const mepExchangeRateInput = document.getElementById('mep-exchange-rate');
    const mepStatusBadge = document.getElementById('mep-status');
    const mepApiErrorMsg = document.getElementById('mep-api-error-msg');
    const resPriceArs = document.getElementById('res-price-ars');

    // Resumen y copia
    const summaryText = document.getElementById('summary-text');
    const btnCopySummary = document.getElementById('btn-copy-summary');


    // --- 1. SEGURIDAD Y ACCESO (LOGIN) ---

    // Verificar si ya está autenticado en la sesión
    if (sessionStorage.getItem('ja_pricing_auth') === 'true') {
        showApp();
    }

    // Manejar el submit del login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = usernameInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        if (username === AUTH_USER && password === AUTH_PASS) {
            sessionStorage.setItem('ja_pricing_auth', 'true');
            loginError.classList.add('hidden');
            showApp();
        } else {
            loginError.classList.remove('hidden');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });

    // Cerrar Sesión
    btnLogout.addEventListener('click', () => {
        sessionStorage.removeItem('ja_pricing_auth');
        hideApp();
    });

    function showApp() {
        loginContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
        btnLogout.classList.remove('hidden');
        
        // Inicializar datos una vez que se accede
        initApp();
    }

    function hideApp() {
        appContainer.classList.add('hidden');
        btnLogout.classList.add('hidden');
        loginContainer.classList.remove('hidden');
        
        // Resetear inputs del formulario
        pricingForm.reset();
        usernameInput.value = '';
        passwordInput.value = '';
        
        // Volver a colapsar secciones
        // Colapsar áreas y etapas
        AREAS.forEach(area => {
            areaContainers[area].classList.remove('expanded');
            areaBoxes[area].classList.remove('active');
            STAGES.forEach(stage => {
                stageContainers[area][stage].classList.remove('expanded');
                stageBoxes[area][stage].classList.remove('active');
            });
        });
    }


    // --- 2. INICIALIZACIÓN DE LA APLICACIÓN ---

    function initApp() {
        // Establecer el valor hora ajustado en los resultados (fijo)
        resHourlyValue.textContent = `USD ${VALOR_HORA_AJUSTADO.toFixed(2)}`;

        // Cargar Tipo de Cambio MEP
        fetchExchangeRate();

        // Configurar listeners para inputs de cálculo en tiempo real
        setupPricingListeners();

        // Ejecutar primer cálculo con valores por defecto
        calculatePricing();
    }


    // --- 3. TIPO DE CAMBIO MEP (API) ---

    function fetchExchangeRate() {
        mepStatusBadge.textContent = "Cargando...";
        mepStatusBadge.className = "mep-status-badge";
        mepApiErrorMsg.classList.add('hidden');

        fetch('https://dolarapi.com/v1/dolares/bolsa')
            .then(response => {
                if (!response.ok) throw new Error('Network response error');
                return response.json();
            })
            .then(data => {
                if (data && data.venta) {
                    tcMep = parseFloat(data.venta);
                    mepExchangeRateInput.value = tcMep.toFixed(2);
                    mepStatusBadge.textContent = "API OK";
                    mepStatusBadge.classList.add('success');
                    mepApiErrorMsg.classList.add('hidden');
                    calculatePricing();
                } else {
                    throw new Error('Invalid data format');
                }
            })
            .catch(error => {
                console.error('Error al obtener Dólar MEP:', error);
                mepStatusBadge.textContent = "Manual";
                mepStatusBadge.classList.add('error');
                mepApiErrorMsg.classList.remove('hidden');
                
                // Fallback razonable si la API falla
                if (!mepExchangeRateInput.value || parseFloat(mepExchangeRateInput.value) === 0) {
                    mepExchangeRateInput.value = "1250.00"; // Valor de contingencia inicial
                }
                tcMep = parseFloat(mepExchangeRateInput.value) || 1250.00;
                calculatePricing();
            });
    }

    // Permitir cambios manuales en el tipo de cambio
    mepExchangeRateInput.addEventListener('input', () => {
        tcMep = parseFloat(mepExchangeRateInput.value) || 0;
        calculatePricing();
    });


    // --- 4. CONFIGURACIÓN DE LISTENERS INTERACTIVOS ---

    function setupPricingListeners() {
        
        // Listeners para inputs de texto y select simple
        clientNameInput.addEventListener('input', scheduleCalculation);
        companyMomentSelect.addEventListener('change', calculatePricing);

        // Category & Contact Type Radios
        const categoryRadios = document.getElementsByName('client-category');
        categoryRadios.forEach(radio => radio.addEventListener('change', calculatePricing));

        const contactRadios = document.getElementsByName('contact-type');
        contactRadios.forEach(radio => radio.addEventListener('change', calculatePricing));

        // Áreas (nivel 1) y sus etapas (nivel 2)
        AREAS.forEach(area => {

            // Listener del checkbox de área
            areaCheckboxes[area].addEventListener('change', (e) => {
                const isChecked = e.target.checked;
                if (isChecked) {
                    areaContainers[area].classList.add('expanded');
                    areaBoxes[area].classList.add('active');
                } else {
                    areaContainers[area].classList.remove('expanded');
                    areaBoxes[area].classList.remove('active');
                    // Desactivar toda la estructura interna
                    STAGES.forEach(stage => {
                        stageCheckboxes[area][stage].checked = false;
                        stageContainers[area][stage].classList.remove('expanded');
                        stageBoxes[area][stage].classList.remove('active');
                        stageContainers[area][stage].querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
                    });
                }
                calculatePricing();
            });

            // Listeners de cada etapa dentro del área
            STAGES.forEach(stage => {
                stageCheckboxes[area][stage].addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                        stageContainers[area][stage].classList.add('expanded');
                        stageBoxes[area][stage].classList.add('active');
                    } else {
                        stageContainers[area][stage].classList.remove('expanded');
                        stageBoxes[area][stage].classList.remove('active');
                        stageContainers[area][stage].querySelectorAll('input[type="checkbox"]').forEach(cb => { cb.checked = false; });
                    }
                    calculatePricing();
                });

                // Listeners de servicios dentro de cada etapa
                const services = stageContainers[area][stage].querySelectorAll('input[type="checkbox"]');
                services.forEach(cb => cb.addEventListener('change', calculatePricing));
            });
        });

        // Sección 3: Horas y Kilómetros (validar números y calcular ×4 al escribir)
        hoursInsituInput.addEventListener('input', () => {
            const weeklyVal = parseFloat(hoursInsituInput.value) || 0;
            hintInsitu.textContent = `×4 = ${(weeklyVal * 4).toFixed(1)} hs/mes`;
            calculatePricing();
        });

        hoursRemoteInput.addEventListener('input', () => {
            const weeklyVal = parseFloat(hoursRemoteInput.value) || 0;
            hintRemote.textContent = `×4 = ${(weeklyVal * 4).toFixed(1)} hs/mes`;
            calculatePricing();
        });

        hoursPlanningInput.addEventListener('input', () => {
            const weeklyVal = parseFloat(hoursPlanningInput.value) || 0;
            hintPlanning.textContent = `×4 = ${(weeklyVal * 4).toFixed(1)} hs/mes`;
            calculatePricing();
        });

        kmWeekInput.addEventListener('input', () => {
            const weeklyVal = parseFloat(kmWeekInput.value) || 0;
            hintKm.textContent = `×4 = ${(weeklyVal * 4).toFixed(0)} km/mes`;
            calculatePricing();
        });

        // Sección 4: Pestañas de Anclaje
        anchorOptionRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const activeOption = e.target.value;
                
                // Mostrar campos correspondientes y ocultar los otros
                Object.keys(anchorFieldBlocks).forEach(optKey => {
                    if (optKey === activeOption) {
                        anchorFieldBlocks[optKey].classList.remove('hidden');
                    } else {
                        anchorFieldBlocks[optKey].classList.add('hidden');
                    }
                });
                calculatePricing();
            });
        });

        // Inputs específicos de anclaje
        productPriceInput.addEventListener('input', calculatePricing);
        interventionMonthsInput.addEventListener('input', calculatePricing);
        clientHourlyRateInput.addEventListener('input', calculatePricing);
        competitorHourlyRateInput.addEventListener('input', calculatePricing);
        salaryReferenceInput.addEventListener('input', calculatePricing);

        // Botón de Copiado
        btnCopySummary.addEventListener('click', copySummaryToClipboard);
    }

    function scheduleCalculation() {
        clearTimeout(calculationDebounceTimeout);
        calculationDebounceTimeout = setTimeout(calculatePricing, 150);
    }


    // --- 5. ALGORITMO DE CÁLCULO ---

    function calculatePricing() {
        // Evitar cálculos si la app no está visible
        if (appContainer.classList.contains('hidden')) return;

        // -- PASO 1: Horas y Desplazamiento --
        const hsInsituSemana = parseFloat(hoursInsituInput.value) || 0;
        const hsRemotasSemana = parseFloat(hoursRemoteInput.value) || 0;
        const hsPlanificacionSemana = parseFloat(hoursPlanningInput.value) || 0;
        const kmSemana = parseFloat(kmWeekInput.value) || 0;

        const hsInsituMes = hsInsituSemana * 4;
        const hsRemotasMes = hsRemotasSemana * 4;
        const hsPlanificacionMes = hsPlanificacionSemana * 4;

        const totalHorasMes = hsInsituMes + hsRemotasMes + hsPlanificacionMes;
        const totalKmMes = kmSemana * 4;

        // Actualizar UI de Horas
        totalHoursMonthBadge.textContent = `${totalHorasMes.toFixed(1)} hs/mes`;
        resTotalHours.textContent = `${totalHorasMes.toFixed(1)} hs/mes`;

        // -- PASO 2: Sub-total Operativo --
        const costoHoras = totalHorasMes * VALOR_HORA_AJUSTADO;
        const costoDesplazamiento = totalKmMes * COSTO_KM_USD;
        const subtotalOperativo = costoHoras + costoDesplazamiento;

        resSubtotalOp.textContent = `USD ${subtotalOperativo.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // -- PASO 3: Valor de Anclaje --
        let valorAnclaje = 0;
        const activeAnchorOption = document.querySelector('input[name="anchor-option"]:checked').value;

        if (activeAnchorOption === 'option-a') {
            const precioEstrella = parseFloat(productPriceInput.value) || 0;
            const mesesEstimados = parseFloat(interventionMonthsInput.value) || 1;
            const divisorMeses = mesesEstimados <= 0 ? 1 : mesesEstimados; // Evitar división por cero
            
            valorAnclaje = precioEstrella / divisorMeses;
            calcResultA.textContent = `USD ${valorAnclaje.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (activeAnchorOption === 'option-b') {
            const precioHoraPropio = parseFloat(clientHourlyRateInput.value) || 0;
            const precioHoraCompetencia = parseFloat(competitorHourlyRateInput.value) || 0;
            
            // Delta entre ambos (siempre positivo)
            valorAnclaje = Math.max(0, precioHoraPropio - precioHoraCompetencia);
            calcResultB.textContent = `USD ${valorAnclaje.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (activeAnchorOption === 'option-c') {
            const sueldoSenior = parseFloat(salaryReferenceInput.value) || 0;
            
            valorAnclaje = sueldoSenior;
            calcResultC.textContent = `USD ${valorAnclaje.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        resAnchorVal.textContent = `USD ${valorAnclaje.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // -- PASO 4: Precio sugerido base --
        const precioSugeridoBase = (subtotalOperativo + valorAnclaje) / 2;

        // -- AJUSTE CONTEXTUAL AUTOMÁTICO --
        const companyMoment = companyMomentSelect.value;
        const contactType = document.querySelector('input[name="contact-type"]:checked').value;
        
        let precioFinalUsd = precioSugeridoBase;
        let ajusteDescripcion = "Ninguno (Estable)";
        let ajustePorcentajeText = "0%";

        // Ocultar alerta de crisis por defecto
        crisisAlert.classList.add('hidden');

        if (companyMoment === 'retraction') {
            // Empresa en retracción: aplicar −12.5%
            precioFinalUsd = precioSugeridoBase * 0.875;
            ajusteDescripcion = "Empresa en Retracción (Descuento -12.5%)";
            ajustePorcentajeText = "-12.5%";
        } else if (companyMoment === 'growth') {
            // Inbound o estable anula el incremento por crecimiento (según especificaciones "Empresa estable o inbound: sin ajuste")
            if (contactType === 'inbound') {
                precioFinalUsd = precioSugeridoBase;
                ajusteDescripcion = "Estable / Contacto Inbound (Sin incremento del +10%)";
                ajustePorcentajeText = "0%";
            } else {
                // Empresa en crecimiento y contacto outbound: +10%
                precioFinalUsd = precioSugeridoBase * 1.10;
                ajusteDescripcion = "Crecimiento Activo / Outbound (+10%)";
                ajustePorcentajeText = "+10%";
            }
        } else if (companyMoment === 'crisis') {
            // Empresa en crisis estructural: mostrar alerta
            precioFinalUsd = precioSugeridoBase;
            ajusteDescripcion = "Crisis Estructural (Evaluar Viabilidad - Sin ajuste)";
            ajustePorcentajeText = "Alerta";
            crisisAlert.classList.remove('hidden');
        } else {
            // Estable: Sin ajuste
            precioFinalUsd = precioSugeridoBase;
            ajusteDescripcion = "Estable (Sin ajuste)";
            ajustePorcentajeText = "0%";
        }

        // Actualizar UI del ajuste y precios finales
        resContextAdj.textContent = `${ajustePorcentajeText} — ${ajusteDescripcion}`;
        resPriceUsd.textContent = `USD ${precioFinalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Precio en Pesos (MEP)
        const precioFinalArs = precioFinalUsd * tcMep;
        resPriceArs.textContent = `$ ${precioFinalArs.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

        // Generar el bloque de resumen
        generateSummaryText(
            totalHorasMes,
            subtotalOperativo,
            valorAnclaje,
            ajustePorcentajeText,
            ajusteDescripcion,
            precioFinalUsd,
            precioFinalArs
        );
    }


    // --- 6. GENERACIÓN DEL RESUMEN AUTO-GENERADO ---

    function generateSummaryText(totalHorasMes, subtotalOperativo, valorAnclaje, ajustePct, ajusteDesc, finalUsd, finalArs) {
        const clientName = clientNameInput.value.trim() || "[Nombre del Cliente]";
        
        // Categoría
        const categoryVal = document.querySelector('input[name="client-category"]:checked').value;
        const categoryText = {
            'mini': 'Mini-empresa (Hasta 5 operarios)',
            'pymeb': 'PYME B (Entre 5 y 12 operarios)',
            'pymea': 'PYME A (Hasta 40 operarios)'
        }[categoryVal];

        // Contacto
        const contactVal = document.querySelector('input[name="contact-type"]:checked').value;
        const contactText = contactVal === 'inbound' ? 'Inbound (Estudio)' : 'Outbound (Visita)';

        // Momento
        const momentVal = companyMomentSelect.value;
        const momentText = {
            'stable': 'Estable',
            'retraction': 'En retracción con potencial',
            'growth': 'En crecimiento activo',
            'crisis': 'En crisis estructural (Evaluar viabilidad)'
        }[momentVal];

        // Recolectar áreas, etapas y servicios activos
        const AREA_NAMES = {
            dcv:    'DISEÑO EN COMUNICACIÓN VISUAL',
            me:     'MARKETING ESTRATÉGICO',
            growth: 'MARKETING GROWTH'
        };

        let etapasActivasTexto = "";
        let tieneEtapas = false;

        AREAS.forEach(area => {
            if (!areaCheckboxes[area].checked) return;

            let areaTexto  = `--- ${AREA_NAMES[area]} ---\n`;
            let areaConEtapas = false;

            STAGES.forEach(stage => {
                if (!stageCheckboxes[area][stage].checked) return;
                tieneEtapas   = true;
                areaConEtapas = true;

                const activeServices = [];
                stageContainers[area][stage].querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
                    activeServices.push(cb.value);
                });

                const stageName = stage.toUpperCase();
                if (activeServices.length > 0) {
                    areaTexto += `  ${stageName}: ${activeServices.join(" / ")}\n`;
                } else {
                    areaTexto += `  ${stageName}: Etapa activa (Sin servicios específicos detallados)\n`;
                }
            });

            if (areaConEtapas) etapasActivasTexto += areaTexto;
        });

        if (!tieneEtapas) {
            etapasActivasTexto = "[Ninguna área de intervención activa seleccionada]\n";
        }

        // Horas detalladas
        const hsInsitu = (parseFloat(hoursInsituInput.value) || 0) * 4;
        const hsRemote = (parseFloat(hoursRemoteInput.value) || 0) * 4;
        const hsPlanning = (parseFloat(hoursPlanningInput.value) || 0) * 4;
        const totalKm = (parseFloat(kmWeekInput.value) || 0) * 4;

        // Metodo de Anclaje
        const activeAnchorOption = document.querySelector('input[name="anchor-option"]:checked').value;
        let anclajeDetalle = "";
        if (activeAnchorOption === 'option-a') {
            anclajeDetalle = `Opción A (Fabricante) — Prod: USD ${parseFloat(productPriceInput.value) || 0} / Meses: ${parseFloat(interventionMonthsInput.value) || 12}`;
        } else if (activeAnchorOption === 'option-b') {
            anclajeDetalle = `Opción B (Servicios) — Propia: USD ${parseFloat(clientHourlyRateInput.value) || 0}/hs / Competencia: USD ${parseFloat(competitorHourlyRateInput.value) || 0}/hs`;
        } else if (activeAnchorOption === 'option-c') {
            anclajeDetalle = `Opción C (Mixta) — Sueldo admin senior: USD ${parseFloat(salaryReferenceInput.value) || 0}`;
        }

        // Obtener fecha formateada
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const fechaHoy = new Date().toLocaleDateString('es-AR', options);

        // Armar el template final del presupuesto
        const summary = 
`==================================================
PROPUESTA DE VALORACIÓN ECONÓMICA — jArismendi®
==================================================
FECHA: ${fechaHoy}
CLIENTE: ${clientName}
CATEGORÍA: ${categoryText}
CONTACTO: ${contactText}
ESTADO DE LA EMPRESA: ${momentText}
--------------------------------------------------
ALCANCE DE INTERVENCIÓN ACTIVO:
${etapasActivasTexto}--------------------------------------------------
DEDICACIÓN HORARIA ESTIMADA:
- Horas In Situ (estudio/viaje): ${hsInsitu.toFixed(1)} hs/mes
- Horas Remotas (ejecución): ${hsRemote.toFixed(1)} hs/mes
- Horas Planificación (estrategia): ${hsPlanning.toFixed(1)} hs/mes
>> TOTAL DEDICACIÓN MENSUAL: ${totalHorasMes.toFixed(1)} hs
>> DESPLAZAMIENTO ESTIMADO: ${totalKm.toFixed(0)} km/mes
--------------------------------------------------
MÉTRICAS DE CÁLCULO E ANCLAJE:
- Valor Hora Ajustado jArismendi: USD ${VALOR_HORA_AJUSTADO.toFixed(2)}
- Costo Operativo (Horas + Desplazamiento): USD ${subtotalOperativo.toFixed(2)}
- Anclaje del Cliente: USD ${valorAnclaje.toFixed(2)} [${anclajeDetalle}]
- Ajuste Contextual: ${ajustePct} (${ajusteDesc})
--------------------------------------------------
HONORARIO MENSUAL SUGERIDO:
>> INVERSIÓN MENSUAL SUGERIDA: USD ${finalUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
>> TIPO DE CAMBIO MEP DE REFERENCIA: $ ${tcMep.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
>> VALOR EQUIVALENTE EN PESOS: $ ${finalArs.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / mes

*Nota interna: Estimación válida para la preparación del presupuesto formal.*
==================================================`;

        summaryText.value = summary;
    }


    // --- 7. COPIADO EN PORTAPAPELES CON FEEDBACK ---

    function copySummaryToClipboard() {
        const text = summaryText.value;
        if (!text) return;

        navigator.clipboard.writeText(text)
            .then(() => {
                // Feedback visual premium en el botón
                const originalText = btnCopySummary.textContent;
                btnCopySummary.textContent = "¡Resumen Copiado! ✓";
                btnCopySummary.style.backgroundColor = "#27696D"; // Cambia al verde jA
                btnCopySummary.style.color = "#FFFFFF";
                btnCopySummary.style.borderColor = "#27696D";

                setTimeout(() => {
                    btnCopySummary.textContent = originalText;
                    btnCopySummary.style.backgroundColor = ""; // Resetea a estilos CSS
                    btnCopySummary.style.color = "";
                    btnCopySummary.style.borderColor = "";
                }, 2000);
            })
            .catch(err => {
                console.error('Error al copiar al portapapeles:', err);
                alert('No se pudo copiar automáticamente. Por favor selecciona el texto del resumen y cópialo manualmente.');
            });
    }

});
