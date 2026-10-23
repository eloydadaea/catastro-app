// ====== CONFIGURACIÓN SUPABASE ======
const supabaseUrl = 'https://kseaqcwhsvenxtmpqjvu.supabase.co'; // REEMPLAZAR
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtzZWFxY3doc3Zlbnh0bXBxanZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI3NzA3NzYsImV4cCI6MjEwODM0Njc3Nn0.xb0jWWmc1AAplHZ_Whgy3d-OCvsQyKHR3W6zFpvcKvA'; // REEMPLAZAR
const clienteSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ====== DATA DE IMPEDIMENTOS Y SUBMOTIVOS ======
const impedimentos = [
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
  {"codigo": "DE24", "descripcion": "Medidor trifasico no ingresa en caja L", "tiene_sub": false}
];

const submotivos = {
  "DE01": [
    {"codigo": "CA03", "descripcion": "Medidor interno"},
    {"codigo": "CA04", "descripcion": "Carga cliente mayor a 2 amperios"},
    {"codigo": "CA05", "descripcion": "Caja de medidor con reja / candado"}
  ],
  "DE02": [
    {"codigo": "NE2", "descripcion": "Propietario o familiar, no desea el catastro"},
    {"codigo": "NE4", "descripcion": "Encargado(a) o Inquilino, no tiene autorización"}
  ],
  "DE05": [
    {"codigo": "AC1", "descripcion": "Acometida NKY / NYY recalentada"},
    {"codigo": "AC2", "descripcion": "Acometida NKY / NYY corta"},
    {"codigo": "AC7", "descripcion": "Acometida sin tensión"},
    {"codigo": "CA1", "descripcion": "Caja de medidor en mal estado / corroída"},
    {"codigo": "CA5", "descripcion": "Caja embutida"},
    {"codigo": "MU1", "descripcion": "Murete derruido / agrietado"}
  ],
  "DE07": [
    {"codigo": "IN1", "descripcion": "Caja medidor inaccesible por plantas o arbustos"},
    {"codigo": "IN2", "descripcion": "Pared del cliente deteriorado"},
    {"codigo": "IN4", "descripcion": "caja medidor inaccesible por auto estacionado"}
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

// Restricción de 5 fotos y Previsualización para móviles
const fotosInput = document.getElementById('fotos');
const previewContainer = document.getElementById('previewContainer');

fotosInput.addEventListener('change', function() {
    previewContainer.innerHTML = ''; 
    
    if (this.files.length > 5) {
        alert('Solo puedes subir un máximo de 5 fotos.');
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

// ====== COMUNICACIÓN CON SUPABASE ======
document.getElementById('btnBuscar').addEventListener('click', async () => {
    const sum = document.getElementById('suministro').value;
    if (!sum) return alert('Ingresa un suministro');

    const { data, error } = await clienteSupabase
        .from('suministros')
        .select('*')
        .eq('suministro', sum)
        .single();
    
    if (error || !data) {
        alert('Suministro no encontrado en la base de datos.');
        document.getElementById('medidor').value = '';
        document.getElementById('marca').value = '';
    } else {
        document.getElementById('medidor').value = data.medidor;
        document.getElementById('marca').value = data.marca_nombre || data.marca_codigo;
    }
});

document.getElementById('catastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.disabled = true;
    btnGuardar.textContent = 'Subiendo Datos y Fotos...';

    let fotosUrls = [];
    const files = fotosInput.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
        const { error: uploadError } = await clienteSupabase.storage
            .from('fotos_catastro')
            .upload(fileName, file);
        
        if (uploadError) {
            alert('Error al subir foto: ' + uploadError.message);
            btnGuardar.disabled = false;
            btnGuardar.textContent = 'Guardar Registro';
            return;
        }
        
        const { data: urlData } = clienteSupabase.storage
            .from('fotos_catastro')
            .getPublicUrl(fileName);
        
        fotosUrls.push(urlData.publicUrl);
    }

   const registro = {
        suministro: document.getElementById('suministro').value,
        tipo_caja: document.getElementById('tipo_caja').value,
        tipo_chapa: document.getElementById('tipo_chapa').value,
        fase: document.getElementById('fase').value,
        tipo_acometida: document.getElementById('tipo_acometida').value,
        impedimento_cod: document.getElementById('impedimento').value,
        submotivo_cod: subGroup.style.display !== 'none' ? document.getElementById('submotivo').value : null,
        itm_portafusible: document.getElementById('itm_portafusible').value, 
        fotos_urls: fotosUrls
    };

    const { error: insertError } = await clienteSupabase.from('registros_catastro').insert([registro]);

    if (insertError) {
        alert('Error en base de datos: ' + insertError.message);
    } else {
        alert('Catastro registrado exitosamente.');
        document.getElementById('catastroForm').reset();
        subGroup.style.display = 'none';
        previewContainer.innerHTML = '';
    }
    
    btnGuardar.disabled = false;
    btnGuardar.textContent = 'Guardar Registro';
});
