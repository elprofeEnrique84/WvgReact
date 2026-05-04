<?php
/**
 * Api_dashboard.php
 * Ubicación: application/controllers/Api_dashboard.php
 *
 * Expone los datos del dashboard como JSON para ser consumidos por React.
 * NO requiere cambios en Dashboard_model.php ni en las rutas existentes.
 */
class Api_dashboard extends CI_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('session');
        $this->load->model('Dashboard_model');

        // Requiere sesión activa (misma protección que el Dashboard original)
        if ($this->session->userdata('logged_in') !== TRUE) {
            http_response_code(401);
            echo json_encode(['error' => 'No autorizado']);
            exit;
        }

        // Headers para que React (localhost:3000) pueda hacer peticiones
        // En producción, reemplaza * por el dominio real del frontend
        header('Access-Control-Allow-Origin: http://localhost:3000');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Content-Type: application/json; charset=utf-8');

        // Preflight OPTIONS
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
    }

    /**
     * GET /api_dashboard/mantencion?per_page=0
     * Devuelve los 4 listados del dashboard en un solo request.
     */
    function mantencion() {
        $id_cliente = $this->session->userdata('id_cliente');
        $id_perfil  = $this->session->userdata('id_perfil');

        $params = [
            'limit'  => defined('RECORDS_PER_PAGE') ? RECORDS_PER_PAGE : 25,
            'offset' => (int)($this->input->get('per_page') ?? 0),
        ];

        echo json_encode([
            'en_ejecucion' => $this->Dashboard_model->get_all_mantencion_faena_dashboard(
                $params, $id_cliente, $id_perfil
            ),
            'atrasados'    => $this->Dashboard_model->get_all_mantencion_faena_dashboard_atrasados(
                $params, $id_cliente, $id_perfil
            ),
            'desviados'    => $this->Dashboard_model->get_all_mantencion_faena_dashboard_desviados(
                $params, $id_cliente, $id_perfil
            ),
            'planificados' => $this->Dashboard_model->get_all_mantencion_faena_dashboard_planificados(
                $params, $id_cliente, $id_perfil
            ),
            'meta' => [
                'total'     => $this->Dashboard_model->get_all_mantencion_faena_count(),
                'id_perfil' => $id_perfil,
                'timestamp' => date('c'),
            ],
        ], JSON_UNESCAPED_UNICODE);
    }
}
