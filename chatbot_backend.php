<?php
// Start a session to remember the user's conversation state
session_start();

// Set content type to JSON
header('Content-Type: application/json; charset=utf-8');

// --- Main Logic: Get user message and process it ---
$user_message = isset($_POST['message']) ? trim($_POST['message']) : '';
$response = get_bot_response($user_message);

// Simulate a slight delay to feel more natural
usleep(800000); // 0.8 seconds

// --- Send the response back as JSON ---
echo json_encode($response);


// --- Core Chatbot Function: Determines the response ---
function get_bot_response($message) {
    $message_lower = strtolower($message);
    $response = [];

    // Check if the user is in the middle of a booking process
    $conversation_state = isset($_SESSION['state']) ? $_SESSION['state'] : null;

    if ($conversation_state) {
        // --- Handle conversation states (e.g., booking) ---
        switch ($conversation_state) {
            case 'awaiting_vehicle_number':
                $_SESSION['vehicle_number'] = htmlspecialchars($message);
                $_SESSION['state'] = 'awaiting_service_type';
                $response['text'] = "Got it. And what kind of service do you need? (e.g., 'General Maintenance', 'Body Repair')";
                $response['quick_replies'] = ['General Service', 'Repair', 'Breakdown Help'];
                return $response;

            case 'awaiting_service_type':
                $_SESSION['service_type'] = htmlspecialchars($message);
                unset($_SESSION['state']); // End the booking conversation flow
                $vehicle_num = $_SESSION['vehicle_number'];
                $service_type = $_SESSION['service_type'];

                $response['text'] = "Perfect! I've noted that you need '{$service_type}' for vehicle '{$vehicle_num}'. Our team will call you shortly to confirm the details and schedule an appointment. Is there anything else?";
                $response['quick_replies'] = ['Main Menu', 'Thank you'];
                return $response;
        }
    }


    // --- Keyword Matching for general queries ---
    switch (true) {
        // Initialize chat
        case $message === 'init':
        case preg_match('/\b(main menu|start over)\b/i', $message_lower):
            $_SESSION['state'] = null; // Reset state
            $response['text'] = "Welcome to Sri Nisty Automobiles! How can I help you today?";
            $response['quick_replies'] = ['Book a Service', 'Our Services', 'Our Locations'];
            break;
            
        // Greeting
        case preg_match('/\b(hello|hi|hey)\b/i', $message_lower):
            $response['text'] = "Hello! How can I assist you?";
            $response['quick_replies'] = ['Book a Service', 'Our Services', 'Contact Us'];
            break;

        // Start booking process
        case preg_match('/\b(book|appointment|schedule)\b/i', $message_lower):
            $_SESSION['state'] = 'awaiting_vehicle_number'; // Set conversation state
            $response['text'] = "I can help with that. First, what is your vehicle's registration number?";
            $response['quick_replies'] = [];
            break;

        // Services
        case preg_match('/\b(service|repair|maintenance|support)\b/i', $message_lower):
            $response['text'] = "We offer a wide range of services including General Repairs, Periodic Maintenance, Accident Repair, and 24x7 Breakdown Assistance. For more details, visit our <a href='#services' target='_blank'>Services Section</a>. What would you like to do?";
            $response['quick_replies'] = ['Book a Service', 'Contact Us', 'Main Menu'];
            break;

        // Locations
        case preg_match('/\b(location|center|address|where)\b/i', $message_lower):
            $response['text'] = "We have service centers at Peenya, Koramangala, and Hosur Road. You can find maps and details on our <a href='#locations' target='_blank'>Locations page</a>.";
            $response['quick_replies'] = ['Book a Service', 'Main Menu'];
            break;
            
        // Opening Hours
        case preg_match('/\b(hours|open|timing)\b/i', $message_lower):
            $response['text'] = "Our business hours are Monday to Saturday, from 9:00 AM to 6:00 PM.";
            $response['quick_replies'] = ['Book a Service', 'Our Locations'];
            break;

        // Contact information
        case preg_match('/\b(contact|phone|email)\b/i', $message_lower):
            $response['text'] = "You can call us at <a href='tel:+919740884999'>+91 97408 84999</a> or find more details on our <a href='#book' target='_blank'>Contact Us</a> page.";
            $response['quick_replies'] = ['Main Menu'];
            break;

        // Thanks
        case preg_match('/\b(thanks|thank you)\b/i', $message_lower):
            $response['text'] = "You're welcome! Do you need help with anything else?";
            $response['quick_replies'] = ['Yes', 'No, I\'m done'];
            break;
            
        case $message_lower === 'yes':
             $response['text'] = "What can I help you with?";
             $response['quick_replies'] = ['Book a Service', 'Our Services', 'Our Locations'];
             break;

        // Goodbye
        case preg_match('/\b(bye|goodbye|done)\b/i', $message_lower):
            $response['text'] = "Thank you for visiting. Have a great day!";
            $response['quick_replies'] = ['Start Over'];
            break;

        // Default response
        default:
            $response['text'] = "I'm sorry, I didn't quite understand. You can ask me to 'Book a Service', or you can select an option below.";
            $response['quick_replies'] = ['Book a Service', 'Our Services', 'Contact Us'];
            break;
    }
    
    // Add sender information to the response object
    $response['sender'] = 'bot';

    return $response;
}