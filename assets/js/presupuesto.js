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

    // Descripciones de Servicios — 3 áreas × 4 etapas
    const SERVICIOS_DESCRIPCIONES = {
        dcv: {
            idear: {
                "Auditoría de identidad visual": "Evaluación de lo que comunica la marca hoy vs. lo que debería comunicar. Detección de inconsistencias y obsolescencias.",
                "Diagnóstico de marca": "Análisis del negocio, mercado y objetivos. Identificación de brechas y punto de partida real.",
                "Estrategia de comunicación": "Definición de mensaje, canales y frecuencia. Qué decir, a quién, cuándo y por dónde.",
                "Posicionamiento visual": "Definición de ejes de diferenciación y lugar que la marca quiere ocupar en el mercado."
            },
            disenar: {
                "Rebranding": "Rediseño del sistema completo de identidad visual: logo, paleta, tipografías, tono visual y aplicaciones. Incluye identidad visual, diseño editorial y dirección de arte.",
                "Diseño Digital y Redes": "Interfaces, piezas digitales y contenidos para redes con criterio de comunicación, no solo estética.",
                "Comunicación Audiovisual": "Concepto, producción y dirección de piezas audiovisuales alineadas con la identidad de marca."
            },
            desarrollar: {
                "Web Institucional": "Sitio mobile-first construido desde la identidad, sin plantillas genéricas.",
                "E-commerce": "Tienda digital con catálogo, pagos e integración de pedidos.",
                "APPs": "Aplicaciones web a medida con arquitectura escalable.",
                "APIs": "Integraciones y servicios digitales entre plataformas.",
                "Dashboard CRM": "Panel de gestión de clientes y datos comerciales a medida."
            },
            mantener: {
                "Gestión de Contenidos en Redes": "Producción regular de piezas con criterio editorial alineado a la estrategia.",
                "Diseño de Marca": "Evolución y mantenimiento del sistema de identidad visual a medida que la empresa crece.",
                "Análisis y reportes": "Lectura de datos con decisiones claras e informadas.",
                "Mantenimiento de sitio": "Actualizaciones, mejoras y nuevas secciones sin demoras.",
                "Soporte de comunicación": "Cobertura de consultas puntuales y necesidades operativas de comunicación."
            }
        },
        me: {
            idear: {
                "Diagnóstico organizacional": "Análisis de la estructura interna, áreas, roles y dinámicas de trabajo desde un enfoque sistémico.",
                "Auditoría del sistema interno": "Revisión de lo que impulsa y lo que detiene los procesos internos de la organización.",
                "Análisis de canales de venta": "Evaluación de los canales actuales de distribución y acceso al mercado.",
                "Estudio de mercado y competencia": "Mapeo del entorno competitivo y del posicionamiento real de la empresa.",
                "Estudio de clientes actuales": "Perfil del buyer persona construido a partir de los clientes reales de la empresa."
            },
            disenar: {
                "Estructura estratégica": "Definición del modelo organizacional alineado con las metas de crecimiento elegidas.",
                "Rediseño del modelo de negocio": "Reformulación de la lógica de creación y captura de valor de la empresa.",
                "Posicionamiento competitivo": "Definición del lugar que la empresa debe ocupar en su mercado específico.",
                "Mapa de actores clave": "Identificación y rol de los actores estratégicos: socios, proveedores, clientes y aliados."
            },
            desarrollar: {
                "Plan estratégico integral": "Documento de hoja de ruta con metas, plazos, responsables e indicadores.",
                "Propuesta de reorganización interna": "Estructura sugerida de áreas, roles y flujos de trabajo.",
                "Definición de indicadores de éxito": "KPIs específicos para medir el avance del plan.",
                "Plan de capacitación interna": "Programa de formación del equipo en las nuevas dinámicas estratégicas."
            },
            mantener: {
                "Seguimiento del plan estratégico": "Revisión periódica del avance respecto a las metas definidas.",
                "Revisión de procesos": "Ajuste continuo de los flujos internos según los resultados obtenidos.",
                "Reportes de gestión": "Informes ejecutivos periódicos para la toma de decisiones.",
                "Consultoría periódica": "Presencia activa para sostener la dirección estratégica en el tiempo."
            }
        },
        growth: {
            idear: {
                "Estudio de no-clientes": "Investigación de los segmentos que aún no son clientes para identificar escenarios de expansión.",
                "Identificación de escenarios de crecimiento": "Prospección de oportunidades reales de crecimiento para la empresa.",
                "Análisis de oportunidades de mercado": "Detección de nichos, tendencias y espacios no ocupados por la competencia.",
                "Diagnóstico de gestión comercial": "Evaluación del estado actual de la gestión de ventas y relación con clientes."
            },
            disenar: {
                "Diseño del plan de crecimiento (roadmap)": "Construcción del camino estratégico hacia la meta de facturación o expansión.",
                "Diseño del modelo de distribución / comercialización": "Arquitectura de cómo el producto o servicio llega al cliente.",
                "Diseño de la propuesta de valor por segmento": "Definición del diferencial de la empresa para cada tipo de cliente.",
                "Diseño de la estrategia de expansión geográfica": "Plan de entrada a nuevos mercados: Argentina, Brasil u otros."
            },
            desarrollar: {
                "Implementación CRM": "Puesta en marcha del sistema de gestión de clientes para tomar decisiones basadas en datos.",
                "Desarrollo de canales de venta": "Construcción y activación de nuevos canales de distribución y acceso al mercado.",
                "Estructura de representación comercial": "Diseño del modelo de representantes, distribuidores o agentes de venta.",
                "Plan de expansión Argentina / Brasil": "Hoja de ruta concreta para operar en nuevos mercados con red activa."
            },
            mantener: {
                "Conducción de la implementación": "Liderazgo activo del proceso de cambio durante la puesta en marcha del plan.",
                "Trabajo de campo e intervención en áreas": "Presencia semanal en las áreas y personas protagonistas del cambio.",
                "Detección y gestión de ajustes": "Identificación temprana de desvíos y corrección ágil del modelo implementado.",
                "Medición de resultados y revisión continua del modelo": "Disciplina de revisión periódica con datos concretos."
            }
        }
    };

    // Textos narrativos por área (Página 2)
    const AREA_TEXTOS = {
        dcv:    "La intervención en Diseño en Comunicación Visual parte de la identidad de la empresa hacia el mercado. Antes de diseñar cualquier pieza, auditamos lo que la marca comunica hoy, definimos su posicionamiento real y construimos una estrategia de comunicación coherente. La comunicación externa es siempre consecuencia de la identidad — nunca al revés.",
        me:     "El Marketing Estratégico trabaja de la puerta para adentro. Entendemos la organización como sistema: analizamos su estructura, sus procesos y su modelo de negocio para identificar qué la impulsa y qué la detiene. Con ese diagnóstico construimos la hoja de ruta estratégica que alinea la organización con sus metas de crecimiento.",
        growth: "El Marketing Growth diseña e implementa las acciones prospectivas específicas para cada cliente. No hay receta: usamos los datos del diagnóstico para construir un camino de crecimiento único y lo conducimos con disciplina ágil, presencia activa y revisión continua del modelo hasta alcanzar los resultados."
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
        const areas = ['dcv', 'me', 'growth'];
        let activeParagraphs = [];

        areas.forEach(area => {
            const checkbox = document.getElementById(`area-${area}`);
            if (checkbox && checkbox.checked) {
                activeParagraphs.push(`<p>${AREA_TEXTOS[area]}</p>`);
            }
        });

        if (activeParagraphs.length === 0) {
            previewNarrativeText.innerHTML = "<p><em>No se han seleccionado áreas de intervención activas en la calculadora. Por favor, seleccioná las áreas requeridas en el panel superior.</em></p>";
        } else {
            previewNarrativeText.innerHTML = activeParagraphs.join("");
        }
    }


    // --- 5. INYECCIÓN DE LISTA DE SERVICIOS (PÁGINA 3) ---
    function injectServicesList() {
        const areas  = ['dcv', 'me', 'growth'];
        const stages = ['idear', 'disenar', 'desarrollar', 'mantener'];
        const areaTitles  = { dcv: 'Diseño en Comunicación Visual', me: 'Marketing Estratégico', growth: 'Marketing Growth' };
        const stageTitles = { idear: 'Idear', disenar: 'Diseñar', desarrollar: 'Desarrollar', mantener: 'Mantener' };

        let html  = "";
        let count = 0;

        areas.forEach(area => {
            const areaCheckbox = document.getElementById(`area-${area}`);
            if (!areaCheckbox || !areaCheckbox.checked) return;

            let areaHtml  = "";
            let areaCount = 0;

            stages.forEach(stage => {
                const stageCheckbox = document.getElementById(`stage-${area}-${stage}`);
                if (!stageCheckbox || !stageCheckbox.checked) return;

                const checkedServices = [];
                document.querySelectorAll(`input[name="services-${area}-${stage}-list"]:checked`)
                    .forEach(cb => checkedServices.push(cb.value));

                if (checkedServices.length > 0) {
                    areaCount++;
                    areaHtml += `<div class="service-group">`;
                    areaHtml += `  <h3 class="service-group-title">${stageTitles[stage]}</h3>`;
                    areaHtml += `  <div class="service-group-list">`;
                    checkedServices.forEach(serviceName => {
                        const desc = (SERVICIOS_DESCRIPCIONES[area] &&
                                      SERVICIOS_DESCRIPCIONES[area][stage] &&
                                      SERVICIOS_DESCRIPCIONES[area][stage][serviceName])
                                      || "Descripción del servicio estratégico.";
                        areaHtml += `<div class="service-item-detail"><strong>· ${serviceName}</strong>: ${desc}</div>`;
                    });
                    areaHtml += `  </div></div>`;
                }
            });

            if (areaCount > 0) {
                count++;
                html += `<div class="service-area-group">`;
                html += `  <h2 class="service-area-title">${areaTitles[area]}</h2>`;
                html += areaHtml;
                html += `</div>`;
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
        const N      = parseInt(document.getElementById('intervention-months').value, 10) || 12;
        const areas  = ['dcv', 'me', 'growth'];
        const stages = ['idear', 'disenar', 'desarrollar', 'mantener'];
        const areaLabels  = { dcv: 'DCV', me: 'ME', growth: 'Growth' };
        const stageLabels = { idear: 'Idear', disenar: 'Diseñar', desarrollar: 'Desarrollar', mantener: 'Mantener' };

        // Recolectar combinaciones área-etapa activas
        const activeRows = [];
        areas.forEach(area => {
            const areaCheckbox = document.getElementById(`area-${area}`);
            if (!areaCheckbox || !areaCheckbox.checked) return;
            stages.forEach(stage => {
                const stageCheckbox = document.getElementById(`stage-${area}-${stage}`);
                if (stageCheckbox && stageCheckbox.checked) {
                    activeRows.push({ area, stage, label: `${areaLabels[area]} — ${stageLabels[stage]}` });
                }
            });
        });

        // 1. Construir estructura CSS grid
        previewTimelineContainer.innerHTML = "";
        const gridElement = document.createElement('div');
        gridElement.className = 'timeline-grid';
        gridElement.style.gridTemplateColumns = `160px repeat(${N}, 1fr)`;
        gridElement.style.columnGap = '8px';

        // 2. Fila de Cabeceras (Meses)
        let headersHtml = `<div class="timeline-header-label">Área / Etapa — Mes</div>`;
        for (let i = 1; i <= N; i++) {
            headersHtml += `<div class="timeline-month-column-header">Mes ${i}</div>`;
        }
        gridElement.innerHTML = headersHtml;

        // 3. Filas por combinación área-etapa activa
        let activeBadgesHtml = "";

        activeRows.forEach(({ area, stage, label }) => {
            activeBadgesHtml += `<span class="timeline-badge-stage ${stage}">${label}</span>`;

            let startMonth = 1, endMonth = N;
            if (stage === 'idear')       { startMonth = 1; endMonth = Math.max(1, Math.round(N * 0.25)); }
            else if (stage === 'disenar')    { startMonth = Math.max(1, Math.round(N * 0.15)); endMonth = Math.max(2, Math.round(N * 0.6)); }
            else if (stage === 'desarrollar') { startMonth = Math.max(2, Math.round(N * 0.35)); endMonth = Math.max(3, N); }
            else if (stage === 'mantener')   { startMonth = Math.max(2, Math.round(N * 0.6)); endMonth = N; }

            const gridStart = startMonth + 1;
            const gridEnd   = endMonth + 2;

            gridElement.innerHTML += `
                <div class="timeline-stage-label">${label}</div>
                <div class="timeline-bar-wrapper ${stage}" style="grid-column: ${gridStart} / ${gridEnd};">
                    <div class="timeline-bar-fill"></div>
                    <div class="timeline-bar-text">${stageLabels[stage]} (Mes ${startMonth} al ${endMonth})</div>
                </div>`;
        });

        if (activeRows.length === 0) {
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
        formalTotalUsd.textContent = document.getElementById('res-price-usd').textContent;
        formalTotalArs.textContent = document.getElementById('res-price-ars').textContent;

        // Recolectar áreas y etapas activas para el texto "Comprende"
        const areas       = ['dcv', 'me', 'growth'];
        const stages      = ['idear', 'disenar', 'desarrollar', 'mantener'];
        const areaLabels  = { dcv: 'Diseño en Comunicación Visual', me: 'Marketing Estratégico', growth: 'Marketing Growth' };
        const stageLabels = { idear: 'Idear', disenar: 'Diseñar', desarrollar: 'Desarrollar', mantener: 'Mantener' };

        const activeAreasList = [];

        areas.forEach(area => {
            const areaCheckbox = document.getElementById(`area-${area}`);
            if (!areaCheckbox || !areaCheckbox.checked) return;

            const activeStagesForArea = [];
            stages.forEach(stage => {
                const stageCheckbox = document.getElementById(`stage-${area}-${stage}`);
                if (stageCheckbox && stageCheckbox.checked) activeStagesForArea.push(stageLabels[stage]);
            });

            activeAreasList.push(
                activeStagesForArea.length > 0
                    ? `${areaLabels[area]} (${activeStagesForArea.join(", ")})`
                    : areaLabels[area]
            );
        });

        const clientName = document.getElementById('client-name').value.trim() || "la empresa";
        formalComprendeSummary.textContent = activeAreasList.length === 0
            ? "Planificación y consultoría en comunicación integral."
            : `Intervención estratégica integral en ${clientName} que abarca las áreas de ${activeAreasList.join("; ")}. El plan contempla diagnóstico, diseño, desarrollo e implementación continua desde la identidad de marca hasta el crecimiento comercial.`;
    }

});
