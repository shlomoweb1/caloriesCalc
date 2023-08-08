<?php
/**
* Plugin Name: machshevon-kaloriot
**/

function register_plugin_styles() {
	wp_register_style( 'machshevon-kaloriot-style', plugins_url( '/machshevon/style.css?v=1.0' ) );
	wp_enqueue_style( 'machshevon-kaloriot-style' );

}
add_action( 'wp_enqueue_scripts', 'register_plugin_styles' );

function register_plugin_script() {
	wp_register_script( 'machshevon-kaloriot-script', plugins_url( '/machshevon/script.js?v=1.0' ) );
	wp_enqueue_script( 'machshevon-kaloriot-script' );
}
add_action( 'wp_enqueue_scripts', 'register_plugin_script' );

// Define the shortcode function to return custom HTML
function machshevon_kaloriot_shortcode() {
    $html = <<<EOT
    <div class="wrapperCaloriesCalc">
        <div class="wrapperLogo">
            <img src="https://mkalori.com/wp-content/plugins/machshevon/assets/logo.png" class="CaloriesCalcLogo" />
        </div>
        <div class="wrapperInput">
            <button class="CaloriesCalFwd disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M10.53 5.47a.75.75 0 0 1 0 1.06l-4.72 4.72H20a.75.75 0 0 1 0 1.5H5.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z"
                        clip-rule="evenodd" />
                </svg>
            </button>
            <button class="CaloriesCalBack disabled">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="currentColor" fill-rule="evenodd"
                        d="M13.47 5.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H4a.75.75 0 0 1 0-1.5h14.19l-4.72-4.72a.75.75 0 0 1 0-1.06Z"
                        clip-rule="evenodd" />
                </svg>
            </button>
            <button class="CaloriesCalSubmit">חשב!</button>
            <input type="text" placeholder="חיפוש" class="CaloriesCalSearchInput" />
            <div id="results" class=""></div>
        </div>
        <div class="CaloriesCalOutput">
            <!-- <h2 class="title">שם המוצר</h2> -->
            <div class="label" data-field="shmmitzrach">--</div>
            <div class="row">
                <div>
                    <h2 class="">קלריות</h2>
                    <div class="label" data-field="food_energy" data-null="--לא נמצא--">--</div>
                </div>
                <div>
                    <h2 class="">פחמימות</h2>
                    <div class="label" data-field="carbohydrates">--</div>
                </div>
            </div>
            <div class="row">
                <div class="">
                    <h2 class="">חלבונים</h2>
                    <div class="label" data-field="protein">--</div>
                </div>
                <div class="">
                    <h2 class="">שומנים</h2>
                    <div class="label" data-field="total_fat">--</div>
                </div>
            </div>
            <div class="row">
                <div class="">
                    <h2 class="">סיבים תזונתיים</h2>
                    <div class="label" data-field="total_dietary_fiber">--</div>
                </div>
            </div>
        </div>
    </div>
EOT;

    return $html;
}

// Register the shortcode
add_shortcode('machshevon_kaloriot', 'machshevon_kaloriot_shortcode');