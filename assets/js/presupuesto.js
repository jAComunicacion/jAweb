/**
 * Generador de Presupuesto Formal — jArismendi® / Antigravity
 * Controla la maquetación en páginas landscape, cronograma dinámico y exportación a PDF.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DEL DOM ---
    const btnGenerateBudget = document.getElementById('btn-generate-budget');
    const btnClosePreview = document.getElementById('btn-close-preview');
    const btnExportPdf = document.getElementById('btn-export-pdf');
    const previewContainer = document.getElementById('presupuesto-preview-container');

    // Elementos de la vista previa para inyección de datos
    const previewClientNamePortada = document.getElementById('preview-client-name-portada');
    const previewDatePortada = document.getElementById('preview-date-portada');
    const previewNarrativeText = document.getElementById('preview-narrative-text');
    const previewServicesList = document.getElementById('preview-services-list');
    const previewTimelineContainer = document.getElementById('preview-timeline-container');
    const previewTimelineActiveStages = document.getElementById('preview-timeline-active-stages');
    
    const previewBudgetNumber = document.getElementById('preview-budget-number');
    const previewDateFormal = document.getElementById('preview-date-formal');
    const formalClientName = document.getElementById('formal-client-name');
    const formalClientAddress = document.getElementById('formal-client-address');
    const formalClientPhone = document.getElementById('formal-client-phone');
    const formalClientIva = document.getElementById('formal-client-iva');
    const formalClientCuit = document.getElementById('formal-client-cuit');
    const formalMonthsCount = document.getElementById('formal-months-count');
    const formalMeetingFreq = document.getElementById('formal-meeting-freq');
    const formalComprendeSummary = document.getElementById('formal-comprende-summary');
    const formalTotalArs = document.getElementById('formal-total-ars');
    const formalTotalUsd = document.getElementById('formal-total-usd');

    // Descripciones de Servicios (Segun skill-pricing)
    const SERVICIOS_DESCRIPCIONES = {
        idear: {
            "Diagnóstico de marca": "Análisis del negocio y el mercado para establecer objetivos y el punto de partida real.",
            "Estrategia de comunicación": "Definición del mensaje, canales y frecuencia (qué decir, a quién y por dónde).",
            "Auditoría de identidad": "Evaluación de la comunicación actual y detección de inconsistencias o desactualizaciones.",
            "Posicionamiento": "Definición de la percepción diferencial y ejes estratégicos que guiarán la marca."
        },
        disenar: {
            "Identidad visual": "Desarrollo del sistema gráfico completo (logo, colores, tipografía, aplicaciones básicas).",
            "Diseño editorial": "Presentaciones, informes y materiales de venta que refuercen la credibilidad comercial.",
            "Diseño digital": "Interfaces de usuario, contenidos y piezas interactivas con criterio de comunicación visual funcional.",
            "Dirección de arte": "Definición conceptual de campañas o sesiones fotográficas para mantener la coherencia de marca."
        },
        desarrollar: {
            "Sitio web institucional": "Sitios mobile-first optimizados y rápidos que reflejen la identidad de la marca.",
            "Landing pages": "Páginas únicas diseñadas para la captación de contactos calificados (conversión).",
            "Aplicaciones web": "Plataformas y herramientas digitales personalizadas con código limpio y arquitectura escalable.",
            "E-commerce": "Tienda online autogestionable con catálogo integrado, pasarela de pagos y gestión de envíos."
        },
        mantener: {
            "Gestión de contenidos": "Producción y publicación periódica de contenidos editoriales y de marca.",
            "Análisis y reportes": "Lectura clara y periódica de datos de rendimiento para toma de decisiones.",
            "Mantenimiento de sitio": "Actualizaciones de seguridad, mejoras técnicas y adición de contenidos.",
            "Soporte de comunicación": "Asesoramiento y respuesta a necesidades operativas de comunicación de la empresa."
        }
    };

    // Textos narrativos metodológicos por etapa (Página 2)
    const METODOLOGIA_TEXTOS = {
        idear: "Iniciaremos con la etapa de **IDEAR**, enfocada en el diagnóstico profundo y el posicionamiento estratégico. Llevaremos adelante un análisis de la identidad de la marca y una auditoría para detectar oportunidades de comunicación, sentando las bases antes de ejecutar cualquier acción en el mercado.",
        disenar: "En la etapa de **DISEÑAR**, daremos forma a la propuesta visual y conceptual. Diseñaremos las piezas necesarias —desde la identidad visual hasta la dirección de arte digital y editorial— asegurando que cada soporte gráfico hable el mismo lenguaje que define a la marca.",
        desarrollar: "Posteriormente, en la etapa de **DESARROLLAR**, implementaremos la infraestructura técnica y digital. Esto incluye el diseño y desarrollo de sitios web institucionales, landing pages de alta conversión, e-commerce o aplicaciones web a medida, enfocándonos en un rendimiento óptimo sin plantillas genéricas.",
        mantener: "Finalmente, en la etapa de **MANTENER**, garantizaremos el crecimiento y optimización continua. Nos encargaremos de la gestión de contenidos, reportes analíticos periódicos y el mantenimiento integral de la web y soporte de comunicación, asegurando la vigencia del proyecto a largo plazo."
    };

    // --- 1. ACCIÓN: GENERAR PRESUPUESTO ---
    if (btnGenerateBudget) {
        btnGenerateBudget.addEventListener('click', () => {
            // Validar que se haya ingresado el nombre del cliente
            const clientNameInput = document.getElementById('client-name');
            if (!clientNameInput.value.trim()) {
                alert("Por favor, ingresá el nombre del cliente en la Sección 1 antes de generar el presupuesto.");
                clientNameInput.focus();
                return;
            }

            // 1. Manejar el número secuencial (localStorage)
            const budgetNum = getNextBudgetNumber();
            previewBudgetNumber.textContent = budgetNum;

            // 2. Inyectar datos del formulario
            injectFormData();

            // 3. Generar la línea narrativa dinámica (Página 2)
            generateNarrativeText();

            // 4. Inyectar servicios incluidos (Página 3)
            injectServicesList();

            // 5. Generar planificación / cronograma (Página 4)
            generateTimelineGrid();

            // 6. Inyectar valores finales de hoja formal (Página 5)
            injectFormalPricing();

            // Revelar sección de vista previa
            previewContainer.classList.remove('hidden');

            // Scroll suave hacia el documento generado
            setTimeout(() => {
                previewContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });
    }

    // Volver al Panel
    if (btnClosePreview) {
        btnClosePreview.addEventListener('click', () => {
            previewContainer.classList.add('hidden');
            document.getElementById('app-container').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Exportar a PDF (Imprimir)
    if (btnExportPdf) {
        btnExportPdf.addEventListener('click', () => {
            window.print();
        });
    }


    // --- 2. LÓGICA DE NÚMERO SECUENCIAL ---
    function getNextBudgetNumber() {
        let seq = localStorage.getItem('jA_presupuesto_numero');
        if (!seq) {
            seq = 17120; // Inicia en el número indicado (suma 1 al generar el primero)
        } else {
            seq = parseInt(seq, 10);
        }
        
        // Sumar 1
        seq += 1;
        localStorage.setItem('jA_presupuesto_numero', seq);

        // Formatear a 7 dígitos con ceros iniciales
        const paddedSeq = String(seq).padStart(7, '0');
        return `0026-${paddedSeq}`;
    }


    // --- 3. INYECCIÓN DE DATOS COMUNES ---
    function injectFormData() {
        const clientName = document.getElementById('client-name').value.trim();
        
        // Inyectar nombre en portada e internos
        previewClientNamePortada.textContent = clientName;
        formalClientName.textContent = clientName;

        // Fechas
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const fecha = new Date();
        const mesNombre = meses[fecha.getMonth()];
        const anio = fecha.getFullYear();
        
        previewDatePortada.textContent = `${mesNombre} de ${anio}`;

        const dia = String(fecha.getDate()).padStart(2, '0');
        const mesNum = String(fecha.getMonth() + 1).padStart(2, '0');
        previewDateFormal.textContent = `${dia}/${mesNum}/${anio}`;

        // Meses de intervención
        const mesesIntervencion = parseInt(document.getElementById('intervention-months').value, 10) || 12;
        formalMonthsCount.textContent = mesesIntervencion;

        // Resetear datos opcionales a placeholders editables
        formalClientAddress.textContent = "Hacer clic para ingresar domicilio...";
        formalClientPhone.textContent = "Hacer clic para ingresar teléfono...";
        formalClientIva.textContent = "Responsable Inscripto";
        formalClientCuit.textContent = "XX-XXXXXXXX-X";
        formalMeetingFreq.textContent = "una reunión por semana";
    }


    // --- 4. GENERACIÓN DE NARRATIVA DINÁMICA (PÁGINA 2) ---
    function generateNarrativeText() {
        const stages = ['idear', 'disenar', 'desarrollar', 'mantener'];
        let activeParagraphs = [];

        stages.forEach(stage => {
            const checkbox = document.getElementById(`stage-${stage}`);
            if (checkbox && checkbox.checked) {
                // Formatear texto en negrita y párrafos fluidos
                let text = METODOLOGIA_TEXTOS[stage];
                activeParagraphs.push(`<p>${text}</p>`);
            }
        });

        if (activeParagraphs.length === 0) {
            previewNarrativeText.innerHTML = "<p><em>No se han seleccionado etapas de intervención activas en la calculadora. Por favor, selecciona las etapas requeridas en el panel superior.</em></p>";
        } else {
            previewNarrativeText.innerHTML = activeParagraphs.join("");
        }
    }


    // --- 5. INYECCIÓN DE LISTA DE SERVICIOS (PÁGINA 3) ---
    function injectServicesList() {
        const stages = ['idear', 'disenar', 'desarrollar', 'mantener'];
        const stageTitles = {
            idear: 'Etapa 1: Idear',
            disenar: 'Etapa 2: Diseñar',
            desarrollar: 'Etapa 3: Desarrollar',
            mantener: 'Etapa 4: Mantener'
        };

        let html = "";
        let count = 0;

        stages.forEach(stage => {
            const stageCheckbox = document.getElementById(`stage-${stage}`);
            if (stageCheckbox && stageCheckbox.checked) {
                // Buscar servicios marcados
                const checkedServices = [];
                const serviceCheckboxes = document.querySelectorAll(`input[name="services-${stage}-list"]:checked`);
                
                serviceCheckboxes.forEach(cb => {
                    checkedServices.push(cb.value);
                });

                if (checkedServices.length > 0) {
                    count++;
                    html += `<div class="service-group">`;
                    html += `  <h3 class="service-group-title">${stageTitles[stage]}</h3>`;
                    html += `  <div class="service-group-list">`;
                    
                    checkedServices.forEach(serviceName => {
                        const desc = SERVICIOS_DESCRIPCIONES[stage][serviceName] || "Descripción del servicio estratégico.";
                        html += `    <div class="service-item-detail">`;
                        html += `      <strong>· ${serviceName}</strong>: ${desc}`;
                        html += `    </div>`;
                    });
                    
                    html += `  </div>`;
                    html += `</div>`;
                }
            }
        });

        if (count === 0) {
            previewServicesList.innerHTML = "<p style='grid-column: 1 / -1; text-align: center; color: #777;'>Ningún servicio específico seleccionado en la calculadora.</p>";
        } else {
            previewServicesList.innerHTML = html;
        }
    }


    // --- 6. CRONOGRAMA DINÁMICO (PÁGINA 4) ---
    function generateTimelineGrid() {
        const N = parseInt(document.getElementById('intervention-months').value, 10) || 12;
        const stages = ['idear', 'disenar', 'desarrollar', 'mantener'];
        const stageLabels = {
            idear: 'Idear',
            disenar: 'Diseñar',
            desarrollar: 'Desarrollar',
            mantener: 'Mantener'
        };

        // 1. Construir estructura CSS grid
        previewTimelineContainer.innerHTML = "";
        const gridElement = document.createElement('div');
        gridElement.className = 'timeline-grid';
        gridElement.style.gridTemplateColumns = `140px repeat(${N}, 1fr)`;
        gridElement.style.columnGap = '8px';

        // 2. Fila de Cabeceras (Meses)
        let headersHtml = `<div class="timeline-header-label">Etapa / Mes</div>`;
        for (let i = 1; i <= N; i++) {
            headersHtml += `<div class="timeline-month-column-header">Mes ${i}</div>`;
        }
        gridElement.innerHTML = headersHtml;

        // 3. Filas por Etapa activa
        let activeBadgesHtml = "";
        let activeStagesCount = 0;

        stages.forEach(stage => {
            const checkbox = document.getElementById(`stage-${stage}`);
            if (checkbox && checkbox.checked) {
                activeStagesCount++;
                activeBadgesHtml += `<span class="timeline-badge-stage ${stage}">${stageLabels[stage]}</span>`;

                // Calcular columnas de inicio y fin aproximadas basadas en el número de meses
                let startMonth = 1;
                let endMonth = N;

                if (stage === 'idear') {
                    startMonth = 1;
                    endMonth = Math.max(1, Math.round(N * 0.25)); // Primer 25% del tiempo
                } else if (stage === 'disenar') {
                    startMonth = Math.max(1, Math.round(N * 0.15)); // Empieza tras un inicio de Idear
                    endMonth = Math.max(2, Math.round(N * 0.6)); // Se estira hasta el 60%
                } else if (stage === 'desarrollar') {
                    startMonth = Math.max(2, Math.round(N * 0.35)); // Arranca en el segundo tercio
                    endMonth = Math.max(3, N); // Termina al final
                } else if (stage === 'mantener') {
                    startMonth = Math.max(2, Math.round(N * 0.6)); // Tercer tercio
                    endMonth = N; // Termina al final
                }

                // Asegurar lógica de columnas en CSS Grid (columna 1 es label, entonces index corre +2)
                const gridStart = startMonth + 1;
                const gridEnd = endMonth + 2; // +2 porque el final en grid es exclusivo

                // Crear bar HTML
                const rowHtml = `
                    <div class="timeline-stage-label">${stageLabels[stage]}</div>
                    <div class="timeline-bar-wrapper ${stage}" style="grid-column: ${gridStart} / ${gridEnd};">
                        <div class="timeline-bar-fill"></div>
                        <div class="timeline-bar-text">${stageLabels[stage]} (Mes ${startMonth} al ${endMonth})</div>
                    </div>
                `;
                gridElement.innerHTML += rowHtml;
            }
        });

        if (activeStagesCount === 0) {
            previewTimelineContainer.innerHTML = "<p style='text-align: center; color: #777; padding: 2rem 0;'>No se seleccionaron etapas de planificación activas.</p>";
            previewTimelineActiveStages.innerHTML = "Ninguna";
        } else {
            previewTimelineContainer.appendChild(gridElement);
            previewTimelineActiveStages.innerHTML = activeBadgesHtml;
        }
    }


    // --- 7. HOJA FORMAL - CÁLCULOS Y TEXTOS (PÁGINA 5) ---
    function injectFormalPricing() {
        // Copiar montos de la UI principal
        const precioUsdText = document.getElementById('res-price-usd').textContent;
        const precioArsText = document.getElementById('res-price-ars').textContent;

        formalTotalUsd.textContent = precioUsdText;
        formalTotalArs.textContent = precioArsText;

        // Generar texto breve para "Comprende"
        const stages = ['idear', 'disenar', 'desarrollar', 'mantener'];
        const stageLabels = {
            idear: 'Idear',
            disenar: 'Diseñar',
            desarrollar: 'Desarrollar',
            mantener: 'Mantener'
        };
        let activeStagesList = [];

        stages.forEach(stage => {
            const checkbox = document.getElementById(`stage-${stage}`);
            if (checkbox && checkbox.checked) {
                activeStagesList.push(stageLabels[stage]);
            }
        });

        let comprendeText = "";
        const clientName = document.getElementById('client-name').value.trim() || "la empresa";

        if (activeStagesList.length === 0) {
            comprendeText = "Planificación y consultoría en comunicación integral.";
        } else {
            comprendeText = `Intervención estratégica integral en ${clientName} que abarca las etapas de ${activeStagesList.join(", ")}. El plan contempla la definición de la identidad de marca, el diseño del sistema visual de comunicación, el desarrollo técnico de soportes digitales y la mantención y soporte continuo del crecimiento del proyecto en el mercado.`;
        }

        formalComprendeSummary.textContent = comprendeText;
    }

});
