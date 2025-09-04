<?php

namespace Classes;

use Exception;
use PHPMailer\PHPMailer\PHPMailer;

class Email
{

    public $email;
    public $nombre;
    public $token;

    public function __construct($email, $nombre, $token)
    {
        $this->email = $email;
        $this->nombre = $nombre;
        $this->token = $token;
    }

    public function configurarMailer(){
        //Crear el objeto de email
        $mail = new PHPMailer();

        try{
            //CONFIRGURACION DE PHPMAILER
            // Protocolo de envio de emails
            $mail->isSMTP();
            $mail->Host = $_ENV['EMAIL_HOST'];
            $mail->SMTPAuth = true;
            $mail->Port = $_ENV['EMAIL_PORT'];
            $mail->Username = $_ENV['EMAIL_USER'];
            $mail->Password = $_ENV['EMAIL_PASS'];
            $mail->SMTPSecure = $_ENV['EMAIL_SECURE'];

            $mail->setFrom($_ENV['EMAIL_FROM'], $_ENV['EMAIL_FROM_NAME']);

            $mail->addAddress($this->email, $this->nombre);

            // Set HTML
            $mail->isHTML(TRUE);
            $mail->CharSet = 'UTF-8';

            return $mail;
        }catch(Exception $e){
            throw new \Exception("Error al configurar PHPMailer: " . $e->getMessage());
        }
    }

    public function enviarConfirmacion()
    {
        try{
            $mail = $this->configurarMailer();

            $mail->Subject = 'Confirma tu cuenta';
            $contenido = "<html>";
            $contenido .= "<p><strong>Hola " . $this->nombre . '</strong> Has creado tu cuenta en App Salon, solo debe confirmarla presionando el siguiente enlace</p>';
    
            $contenido .= "<p> Presiona Aqui: <a href='". $_ENV['APP_URL'] ."/confirmar-cuenta?token=" . $this->token . "'>Confirmar Cuenta</a></p>";
    
            $contenido .= "<p>Si tu no solicistate esta cuenta, puedes ignorar el mensaje</p>";
            $contenido .= "</html>";
            $mail->Body = $contenido;
    
            //Enviar el mail
            $mail->send();
        }catch (Exception $e) {
            error_log("Error al enviar confirmación: {$mail->ErrorInfo}");
        }
    }

    public function enviarInstrucciones(){

        try{
            $mail = $this->configurarMailer();
            $mail->Subject = 'Reestablece tu cuenta';
    
            $contenido = "<html>";
            $contenido .= "<p><strong>Hola " . $this->nombre . '</strong> Has solicitado reestablecer tu password, sigue el siguiente enlace para hacerlo.</p>';
    
            $contenido .= "<p> Presiona Aqui: <a href='". $_ENV['APP_URL'] ."/recuperar?token=" . $this->token . "'>Reestablecer Password</a></p>";
    
            $contenido .= "<p>Si tu no lo solicistate, puedes ignorar el mensaje o reportarlo</p>";
            $contenido .= "</html>";
            $mail->Body = $contenido;
    
            //Enviar el mail
            $mail->send();
        }catch (Exception $e) {
            error_log("Error al enviar instrucciones: {$mail->ErrorInfo}");
        }
    }
}
