// ====== FUNCIÓN PARA NOTIFICACIONES TOAST ======
function mostrarAlerta(mensaje, tipo = 'success') {
    const toast = document.getElementById('custom-toast');
    toast.textContent = mensaje;
    toast.className = `show ${tipo}`;
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
        toast.className = toast.className.replace(`show ${tipo}`, "");
    }, 4000);
}

// ====== CONFIGURACIÓN SUPABASE ======
const supabaseUrl = 'https://kseaqcwhsvenxtmpqjvu.supabase.co'; 
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWFxY3doc3Zlbnh0bXBxanZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NzA3NzYsImV4cCI6MjEwODM0Njc3Nn0.xb0jWWmc1AAplHZ_Whgy3d-OCvsQyKHR3W6zFpvcKvA'; 
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ====== DATA DE IMPEDIMENTOS Y SUBMOTIVOS ======
const impedimentos = [
  {"codigo": "SIN_IMP", "descripcion": "Sin impedimentos", "tiene_sub": false},
  {"codigo": "DE01", "descripcion": "Cliente Ausente", "tiene_sub": true},
  {"codigo": "DE02", "descripcion": "Negativa al catastro", "tiene_sub": true},
  {"codigo": "DE03", "descripcion": "Cliente Coordinara con LDS( Fonoluz) cambio de medidor", "tiene_sub": false},
  {"codigo": "DE05", "descripcion": "Acometida, caja, murete", "tiene_sub": true},
  {"codigo": "DE06", "descripcion": "Caja de medidor con cerradura especial", "tiene_sub": false},
  {"codigo": "DE07", "descripcion": "Medidor Inaccesible y/o Obstruido", "tiene_sub": true},
  {"codigo": "DE11", "descripcion": "Medidor No ubicado en terreno", "tiene_sub": false},
  {"codigo": "DE13", "descripcion": "Servicio electrizado mayor a 10 V", "tiene_sub": false},
  {"codigo": "DE14", "descripcion": "Servicio retirado / cortado", "tiene_sub": false},
  {"codigo": "DE15", "descripcion": "Sin tensión por Interrupción del servicio en la zona", "tiene_sub": false},
  {"codigo": "DE17", "descripcion": "CNR", "tiene_sub": true},
  {"codigo": "DE18", "descripcion": "Zona Peligrosa", "tiene_sub": true},
  {"codigo": "DE20", "descripcion": "Medidor con tapa CPV", "tiene_sub": false},
  {"codigo": "DE21", "descripcion": "Medición indirecta /Centralizado", "tiene_sub": false},
  {"codigo": "DE22", "descripcion": "Predio desabitado", "tiene_sub": false},
  {"codigo": "DE24", "descripcion": "Medidor trifasico no ingresa en caja L", "tiene_sub": false},
  {"codigo": "DE25", "descripcion": "Medidor trifásico cliente ausente", "tiene_sub": false},
  {"codigo": "DE26", "descripcion": "Cambio reprogramado con cliente para otra fecha", "tiene_sub": false},
  {"codigo": "0000", "descripcion": "Caja de medidor con reja / candado", "tiene_sub": false}  
];

const submotivos = {
  "DE01": [
    {"codigo": "CA03", "descripcion": "Medidor interno"},
    {"codigo": "CA04", "descripcion": "Carga cliente mayor a 2 amperios"},
    {"codigo": "CA05", "descripcion": "Caja de medidor con reja / candado"}
  ],
  "DE02": [
    {"codigo": "NE2", "descripcion": "Propietario o familiar, no desea el reemplazo del medidor"},
    {"codigo": "NE4", "descripcion": "Encargado(a) o Inquilino, no tiene autorización"}
  ],
  "DE05": [
    {"codigo": "AC1", "descripcion": "Acometida NKY / NYY recalentada"},
    {"codigo": "AC2", "descripcion": "Acometida NKY / NYY corta"},
    {"codigo": "AC3", "descripcion": "Acometida Concéntrica recalentada"},
    {"codigo": "AC4", "descripcion": "Acometida Concéntrica corta"},
    {"codigo": "AC5", "descripcion": "Acometida Empalmada"},
    {"codigo": "AC6", "descripcion": "Acometida expuesta"},
    {"codigo": "AC7", "descripcion": "Acometida sin tensión"},
    {"codigo": "CA1", "descripcion": "Caja de medidor en mal estado / corroída"},
    {"codigo": "CA2", "descripcion": "Caja de medidor sin fijación en pared (caja en el aire)"},
    {"codigo": "CA3", "descripcion": "Caja de medidor a baja altura o ras del piso"},
    {"codigo": "CA4", "descripcion": "Caja de medidor a altura elevada"},
    {"codigo": "CA5", "descripcion": "Caja embutida"},
    {"codigo": "CA6", "descripcion": "caja MM/MT"},
    {"codigo": "CA7", "descripcion": "Caja toma T-30"},
    {"codigo": "MU1", "descripcion": "Murete derruido / agrietado"},
    {"codigo": "MU2", "descripcion": "murete sin fijación"},
    {"codigo": "MU3", "descripcion": "murete no existente (caja en el aire)"},
    {"codigo": "MU4", "descripcion": "murete enterrado"}
  ],
  "DE07": [
    {"codigo": "IN1", "descripcion": "Caja medidor inaccesible por plantas o arbustos"},
    {"codigo": "IN2", "descripcion": "Pared del cliente deteriorado"},
    {"codigo": "IN3", "descripcion": "Caja medidor inaccesible por árbol"},
    {"codigo": "IN4", "descripcion": "caja medidor inaccesible por auto estacionado"},
    {"codigo": "IN5", "descripcion": "caja medidor inaccesible por puerta o reja de garaje"},
    {"codigo": "IN6", "descripcion": "caja medidor inaccesible por mercaderia de cliente"},
    {"codigo": "IN7", "descripcion": "caja medidor inaccesible por tanque de agua"},
    {"codigo": "IN8", "descripcion": "caja medidor inaccesible por pared o escalera"},
    {"codigo": "IN9", "descripcion": "caja medidor inaccesible por ladrillos o piedras"},
      {"codigo": "000", "descripcion": "caja medidor soldada"}
  ],
  "DE17": [
    {"codigo": "CN1", "descripcion": "CNR por conexión directa prescindiendo del medidor"},
    {"codigo": "CN2", "descripcion": "CNR por directo en bornera"},
    {"codigo": "CN3", "descripcion": "CNR por conexión invertida - en contrafase"},
    {"codigo": "CN4", "descripcion": "CNR por puente en bornera"},
    {"codigo": "CN5", "descripcion": "CNR por cápsula con agujero"},
    {"codigo": "CN6", "descripcion": "CNR por numerador con agujero"}
  ],
  "DE18": [
    {"codigo": "PE1", "descripcion": "zona peligrosa por delincuencia"},
    {"codigo": "PE2", "descripcion": "zona peligrosa por perros"},
    {"codigo": "PE3", "descripcion": "zona peligrosa por terreno desnivel"}
  ]
};

// ====== LOGICA DE INTERFAZ ======
const impSelect = document.getElementById('impedimento');
const subSelect = document.getElementById('submotivo');
const subGroup = document.getElementById('submotivo-group');

impedimentos.forEach(imp => {
    const opt = document.createElement('option');
    opt.value = imp.codigo;
    opt.textContent = `${imp.codigo} - ${imp.descripcion}`;
    opt.dataset.tieneSub = imp.tiene_sub;
    
    // Si el código es SIN_IMP, lo marcamos como seleccionado
    if (imp.codigo === "SIN_IMP") {
        opt.selected = true;
    }
    
    impSelect.appendChild(opt);
});

impSelect.addEventListener('change', (e) => {
    const selected = e.target.options[e.target.selectedIndex];
    const tieneSub = selected.dataset.tieneSub === 'true';
    const val = e.target.value;

    subSelect.innerHTML = '<option value="">Seleccionar Sub motivo</option>';
    
    if (tieneSub && submotivos[val]) {
        subGroup.style.display = 'flex';
        subSelect.required = true;
        submotivos[val].forEach(sub => {
            const opt = document.createElement('option');
            opt.value = sub.codigo;
            opt.textContent = `${sub.codigo} - ${sub.descripcion}`;
            subSelect.appendChild(opt);
        });
    } else {
        subGroup.style.display = 'none';
        subSelect.required = false;
    }
});

// Previsualización y límite flexible al elegir fotos
const fotosInput = document.getElementById('fotos');
const previewContainer = document.getElementById('previewContainer');

fotosInput.addEventListener('change', function() {
    previewContainer.innerHTML = ''; 
    
    if (this.files.length > 5) {
        mostrarAlerta('Solo puedes subir un máximo de 5 fotos.', 'warning');
        this.value = ''; 
        return;
    }

    Array.from(this.files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            previewContainer.appendChild(img);
        };
        reader.readAsDataURL(file);
    });
});

// ====== FUNCIÓN PARA COMPRIMIR IMÁGENES ======
async function comprimirImagen(file, maxWidth = 1200, quality = 0.7) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Redimensionar manteniendo proporción
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob((blob) => {
                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });
                    resolve(compressedFile);
                }, 'image/jpeg', quality);
            };
        };
    });
}

// ====== COMUNICACIÓN CON SUPABASE ======
// Buscar en la nueva estructura de BD
document.getElementById('btnBuscar').addEventListener('click', async () => {
    const sum = document.getElementById('suministro').value;
    if (!sum) return mostrarAlerta('Ingresa un suministro', 'warning');

    const { data, error } = await clienteSupabase
        .from('suministros')
        .select('*')
        .eq('suministro', sum)
        .single();
    
    if (error || !data) {
        mostrarAlerta('Suministro no encontrado en la base de datos.', 'warning');
        document.getElementById('medidor').value = '';
        document.getElementById('distrito').value = '';
        document.getElementById('direccion').value = '';
        document.getElementById('numero_medidor').value = ''; 
        document.getElementById('marca').value = ''; 
        document.getElementById('lectura_medidor').value = '';
    } else {
        document.getElementById('medidor').value = data.medidor_actual || 'SIN DATO';
        document.getElementById('distrito').value = data.distrito || 'SIN DATO';
        document.getElementById('direccion').value = data.direccion || 'SIN DATO';
        document.getElementById('numero_medidor').value = data.numero_medidor || 'SIN DATO'; 
        document.getElementById('marca').value = data.marca || 'SIN DATO'; 
        document.getElementById('lectura_medidor').value = data.lectura_medidor || '';
    }
});

// Guardado de registro y fotos de forma optimizada
document.getElementById('catastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const files = fotosInput.files;

    if (files.length > 5) {
        mostrarAlerta('⚠️ Límite excedido: El sistema solo permite un máximo de 5 fotos.', 'warning');
        return;
    }

    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Guardando rápidamente...';

    let fotosUrls = [];

    // Subir fotos en paralelo si el usuario seleccionó archivos
    if (files.length > 0) {
        try {
            const promesasSubida = Array.from(files).map(async (fileOriginal) => {
                // Comprimir imagen
                const fileComprimido = await comprimirImagen(fileOriginal, 1200, 0.7);
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}_${fileComprimido.name.replace(/\s/g, '_')}`;
                
                // Subir a Supabase Storage
                const { error: uploadError } = await clienteSupabase.storage
                    .from('fotos_catastro')
                    .upload(fileName, fileComprimido);
                
                if (uploadError) throw new Error(uploadError.message);
                
                // Obtener URL pública
                const { data: urlData } = clienteSupabase.storage
                    .from('fotos_catastro')
                    .getPublicUrl(fileName);
                
                return urlData.publicUrl;
            });

            // Esperar a que todas las fotos terminen de subirse simultáneamente
            fotosUrls = await Promise.all(promesasSubida);

        } catch (uploadErr) {
            mostrarAlerta('Error al subir fotos: ' + uploadErr.message, 'error');
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar Registro';
            return;
        }
    }

    // Preparar objeto de registro
    const registro = {
        tecnico: document.getElementById('tecnico').value,
        suministro: document.getElementById('suministro').value,
        lectura_medidor: document.getElementById('lectura_medidor').value || null, 
        tipo_caja: document.getElementById('tipo_caja').value,
        tipo_chapa: document.getElementById('tipo_chapa').value,
        fase: document.getElementById('fase').value,
        tipo_acometida: document.getElementById('tipo_acometida').value,
        impedimento_cod: document.getElementById('impedimento').value,
        submotivo_cod: subGroup.style.display !== 'none' ? document.getElementById('submotivo').value : null,
        itm_portafusible: document.getElementById('itm_portafusible').value, 
        comentarios: document.getElementById('comentarios').value || null,
        fotos_urls: fotosUrls
    };

    // Inserción directa en la base de datos (un solo viaje)
    const { error: insertError } = await clienteSupabase.from('registros_catastro').insert([registro]);

    if (insertError) {
        // Si el código de error es 23505 (violación de llave única / duplicado)
        if (insertError.code === '23505') {
            mostrarAlerta('⚠️ Este suministro ya ha sido registrado anteriormente.', 'warning');
        } else {
            mostrarAlerta('Error en BD: ' + insertError.message, 'error');
        }
    } else {
        mostrarAlerta('Catastro registrado exitosamente.', 'success');
        document.getElementById('catastroForm').reset();
        
        // Forzar opción Sin impedimentos después del reset
        const impSelect = document.getElementById('impedimento');
        impSelect.value = "SIN_IMP";
        
        subGroup.style.display = 'none';
        previewContainer.innerHTML = '';
    }
    
    btnGuardar.disabled = false;
    btnGuardar.textContent = 'Guardar Registro';
});
