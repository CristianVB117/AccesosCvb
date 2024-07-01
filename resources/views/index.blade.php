index.blade.php <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Caseta de guardia</title>
    <link rel="icon" href="{{ asset('Control.ico') }}">
    <link rel="stylesheet" href="https://bootswatch.com/5/lux/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/Estilos.css') }}">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <script src="{{ asset('js/Formulario.js') }}" type="module"></script>

    <style>
        .error {
            display: none;
        }
        .hidden {
            display: none;
        }
        .ContQR {
            margin-top: 20px;
        }
    </style>
</head>
<body style="background-image: url('{{ asset('background.png') }}'); background-size: cover;">
    <div class="container p-4">
        <div class="row">
            <div class="col-md-6 mx-auto">
                <div class="card">
                    <div class="card-body bord">
                        <h2 class="bg-success p-2 text-center text-white" style="--bs-bg-opacity: .9;">Registro Visitante UT</h2>

                        <form id="task-form">
                            <div class="mb-3">
                                <label for="task-imagen" class="form-label">Fotografía para ID:</label>
                                <input type="file" name="task-imagen" id="task-imagen" class="form-control" accept="image/*">
                            </div>

                            <div class="mb-3">
                                <label for="task-nombre" class="form-label">Nombre completo:</label>
                                <input type="text" id="task-nombre" class="form-control" placeholder="Nombre">
                            </div>

                            <div class="mb-3">
                                <label for="task-motivo" class="form-label">Motivo de acceso:</label>
                                <select name="task-motivo" id="task-motivo" class="form-select">
                                    <option value="personal">Personal</option>
                                    <option value="academico">Académico</option>
                                    <option value="inscripciones">Inscripciones</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>

                            <div class="mb-3 hidden" id="task-motivo-otro-container">
                                <label for="task-motivo-otro" class="form-label">Especifique el motivo:</label>
                                <input type="text" id="task-motivo-otro" class="form-control" placeholder="Especifique el motivo">
                            </div>

                            <div class="mb-3">
                                <label for="task-fecha" class="form-label">Fecha de visita:</label>
                                <input type="datetime-local" id="task-fecha" class="form-control" name="task-fecha" placeholder="Seleccione fecha y hora">
                                <br>
                                <span class="alert alert-danger error" id="error-message" role="alert">Fuera de día laboral</span>
                                <span class="alert alert-warning text-info" id="error-messages" role="alert">Fuera de horario laboral</span>
                            </div>
                            <br>

                            <div class="mb-3">
                                <label for="task-correo" class="form-label">Correo electrónico:</label>
                                <input type="email" id="task-correo" class="form-control" placeholder="Correo electrónico">
                            </div>

                            <div class="mb-3">
                                <label for="task-telefono" class="form-label">Teléfono:</label>
                                <input type="tel" id="task-telefono" class="form-control" placeholder="+52 ##########">
                            </div>

                            <button class="btn btn-primary mb-3" id="btn-task-form">Guardar y Generar QR</button>
                            <button type="reset" name="Limpieza" class="btn btn-dark mb-3">Limpiar</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <h1 class="h4 text-center mb-4" style="background-color: grey; color: whitesmoke;">Personas registradas</h1>
    
    <div class="d-flex justify-content-center">
        <div class="bg-light p-4 rounded">
            <div id="tasks-container"></div>
        </div>
    </div>
</body>
</html>