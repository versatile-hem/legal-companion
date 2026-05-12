package com.suits.clients.service;

import com.suits.auth.entity.User;
import com.suits.auth.repository.UserRepository;
import com.suits.clients.dto.ClientRequest;
import com.suits.clients.dto.ClientResponse;
import com.suits.clients.entity.Client;
import com.suits.clients.repository.ClientRepository;
import com.suits.common.dto.PageResponse;
import com.suits.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class ClientService {

    private final ClientRepository clientRepository;
    private final UserRepository userRepository;

    public ClientService(ClientRepository clientRepository, UserRepository userRepository) {
        this.clientRepository = clientRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ClientResponse> getAllClients(Pageable pageable) {
        Page<Client> clients = clientRepository.findAllActive(pageable);
        return PageResponse.fromPage(clients.map(ClientResponse::fromEntity));
    }

    @Transactional(readOnly = true)
    public ClientResponse getClientById(UUID id) {
        Client client = clientRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));
        return ClientResponse.fromEntity(client);
    }

    public ClientResponse createClient(ClientRequest request) {

        // Check if CIN already exists
        if (request.getCin() != null) {
            clientRepository.findByCinAndDeletedAtIsNull(request.getCin())
                    .ifPresent(c -> {
                        throw new RuntimeException("Client with CIN " + request.getCin() + " already exists");
                    });
        }

        User assignedManager = null;
        if (request.getAssignedManagerId() != null) {
            assignedManager = userRepository.findById(UUID.fromString(request.getAssignedManagerId()))
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedManagerId()));
        }

        Client client = new Client();
        client.setName(request.getName());
        client.setCin(request.getCin());
        client.setPan(request.getPan());
        client.setGst(request.getGst());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setAddress(request.getAddress());
        client.setCity(request.getCity());
        client.setState(request.getState());
        client.setPincode(request.getPincode());
        client.setEntityType(Client.EntityType.valueOf(request.getEntityType()));
        client.setAssignedManager(assignedManager);
        client.setStatus(Client.Status.ACTIVE);

        Client savedClient = clientRepository.save(client);
        return ClientResponse.fromEntity(savedClient);
    }

    public ClientResponse updateClient(UUID id, ClientRequest request) {
        Client client = clientRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));

        client.setName(request.getName());
        client.setCin(request.getCin());
        client.setPan(request.getPan());
        client.setGst(request.getGst());
        client.setEmail(request.getEmail());
        client.setPhone(request.getPhone());
        client.setAddress(request.getAddress());
        client.setCity(request.getCity());
        client.setState(request.getState());
        client.setPincode(request.getPincode());
        client.setEntityType(Client.EntityType.valueOf(request.getEntityType()));

        if (request.getAssignedManagerId() != null) {
            User assignedManager = userRepository.findById(UUID.fromString(request.getAssignedManagerId()))
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getAssignedManagerId()));
            client.setAssignedManager(assignedManager);
        }

        if (request.getStatus() != null) {
            client.setStatus(Client.Status.valueOf(request.getStatus()));
        }

        Client updatedClient = clientRepository.save(client);
        return ClientResponse.fromEntity(updatedClient);
    }

    public void deleteClient(UUID id) {
        Client client = clientRepository.findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client", "id", id));

        client.setDeletedAt(LocalDateTime.now());
        clientRepository.save(client);
    }

    @Transactional(readOnly = true)
    public PageResponse<ClientResponse> searchClients(String name, Pageable pageable) {
        Page<Client> clients = clientRepository.searchByName(name, pageable);
        return PageResponse.fromPage(clients.map(ClientResponse::fromEntity));
    }
}
