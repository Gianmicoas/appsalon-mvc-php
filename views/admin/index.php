<?php
    include_once __DIR__ .'/../templates/barra.php';
?>
<h1 class="nombre-pagina">Panel de Administración</h1>

<h2>Buscar Citas</h2>
<div class="busqueda">
    <form class="formulario">
        <div class="campo">
            <label for="fecha">Fecha</label>
            <input 
                type="date"
                id="fecha"
                name="fecha"
                value="<?php echo $fecha ?>"
            />
        </div>
    </form>
</div>

<?php
    if(count($citas) === 0){
        echo "<h2>No Hay Citas en esta Fecha</h2>";
    }
?>

<div class="citas-admin">
    <ul class="citas">
        <?php
        $idCita = 0;
            // Key es el numero o posicion el registro en el arreglo 
            foreach( $citas as $key => $cita ){
                if( $idCita !== $cita->id){
                    $total = 0;
        ?>
        <li>
                <p>ID: <span><?php echo $cita->id; ?></span></p>
                <p>Hora: <span><?php echo $cita->hora; ?></span></p>
                <p>Cliente: <span><?php echo $cita->cliente; ?></span></p>
                <p>Email: <span><?php echo $cita->email; ?></span></p>
                
                <h3>Servicios</h3>
        </li>
            <?php
                $idCita = $cita->id;
            } // Fin if
                $total += $cita->precio;
            ?>
                <p class="servicio"><?php echo $cita->servicio . " " . $cita->precio ?></p>

                <?php
                    //retorna el ID en el q nos encontreamos
                    $actual = $cita->id;
                    //Indice del Arreglo de la base de datos
                    $proximo = $citas[$key +1]->id ?? 0;

                    if(esUltimo($actual, $proximo)){?>
                        <p class="total">Total: <span>$ <?php echo $total ?></span></p>

                        <form action="/api/eliminar" method="POST" id="formEliminar">
                            <input type="hidden" name="id" value="<?php echo $cita->id; ?>">
                            <input 
                            type="submit" 
                            class="boton-eliminar" 
                            value="Eliminar"
                            onclick="confirmarDelete(event)"
                            />
                        </form>
                        
                    <?php
                    }
                } // Fin  foreach?>
    </ul>
</div>

<?php
    $script = "
        <script src='https://cdn.jsdelivr.net/npm/sweetalert2@11'></script>
        <script src='build/js/buscador.js'></script>
    ";
?>